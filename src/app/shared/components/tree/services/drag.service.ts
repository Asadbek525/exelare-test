import { computed, inject, Injectable, signal } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { MessageService } from 'primeng/api';

import {
  DEFAULT_ICON,
  DraggedEntityData,
  DropListData,
  ENTITY_TYPE_ICONS,
  FlatTreeNode,
  isExternalEntity,
  isTreeNode,
  ITreeNode,
  StoredTreeState,
  TREE_STORAGE_KEY,
  TREE_STORAGE_VERSION,
  TreeDrag,
  TreeDropList,
} from '../models';

import { TreeUtils } from '../utils';
import { EntityIds } from '../../../../core/services/menu-builder.service';

/**
 * Service responsible for tree drag-and-drop operations and state management
 *
 * Features:
 * - External entity drops (candidates, jobs, etc.) into tree
 * - Internal tree node reordering
 * - Subfolder management (subfolders appear at top)
 * - State persistence (localStorage + backend sync stub)
 */
@Injectable({
  providedIn: 'root',
})
export class DragService {
  private readonly messageService = inject(MessageService);

  /** Tree items state */
  readonly items = signal<ITreeNode[]>([]);

  /** Computed parent map for quick parent lookups */
  readonly parentMap = computed(() => TreeUtils.buildParentMap(this.items()));

  /** Currently dragged item (tree node or external entity) */
  readonly draggedItem = signal<ITreeNode | DraggedEntityData | null>(null);

  /** Currently hovered drop target */
  readonly hoveredTarget = signal<ITreeNode | null>(null);

  /** Drop position indicator: 'before' | 'into' | 'after' */
  readonly dropPosition = signal<'before' | 'into' | 'after' | null>(null);

  /** Auto-expand timer for folders */
  private expandTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly EXPAND_DELAY = 800; // ms before auto-expanding

  constructor() {
    this.loadFromStorage();
  }

  // ============================================================================
  // Public API
  // ============================================================================

  /**
   * Start dragging an item
   */
  startDrag(item: ITreeNode | DraggedEntityData): void {
    this.draggedItem.set(item);
  }

  /**
   * End dragging
   */
  endDrag(): void {
    this.draggedItem.set(null);
    this.hoveredTarget.set(null);
    this.dropPosition.set(null);
    this.cancelExpandTimer();
  }

  /**
   * Set tree items directly (e.g. from backend)
   */
  setItems(items: ITreeNode[]): void {
    this.items.set(items);
  }

  /**
   * Set hovered target when entering a drop zone
   */
  setHoveredTarget(target: ITreeNode | null): void {
    const prevTarget = this.hoveredTarget();
    this.hoveredTarget.set(target);

    // Cancel previous timer if target changed
    if (prevTarget?.id !== target?.id) {
      this.cancelExpandTimer();
    }

    // Start auto-expand timer for collapsed droppable folders
    if (target && target.droppable && target.children?.length && !target.expanded) {
      this.startExpandTimer(target);
    }
  }

  /**
   * Set drop position based on mouse Y position within node
   * @param position - 'before' (top 25%), 'into' (middle 50%), 'after' (bottom 25%)
   */
  setDropPosition(position: 'before' | 'into' | 'after' | null): void {
    this.dropPosition.set(position);
  }

  /**
   * Check if a node is a valid drop target for the currently dragged item
   */
  isValidDropTarget(targetNode: ITreeNode): boolean {
    const dragged = this.draggedItem();
    if (!dragged || !targetNode.droppable) {
      return false;
    }

    if (isTreeNode(dragged)) {
      return this.canDropTreeNode(dragged, targetNode);
    }

    return this.canDropEntity(dragged, targetNode);
  }

  /**
   * CDK drag predicate - determines if an item can be dropped on a target
   */
  canDrop = (drag: TreeDrag, drop: TreeDropList): boolean => {
    const dragData = drag.data;
    const targetNode = drop.data?.node;

    if (!dragData || !targetNode?.droppable) {
      return false;
    }

    if (isTreeNode(dragData)) {
      return this.canDropTreeNode(dragData, targetNode);
    }

    return this.canDropEntity(dragData, targetNode);
  };

  /**
   * Handle drop event from CDK drag-drop
   */
  handleDrop(event: CdkDragDrop<DropListData, unknown>, targetNode?: ITreeNode): void {
    const dragData = event.item.data as DraggedEntityData | ITreeNode;
    const dropListData = event.container.data;
    const dropTarget = targetNode || dropListData?.node;

    if (isExternalEntity(dragData)) {
      this.handleEntityDrop(dragData, dropTarget);
    } else {
      this.handleTreeNodeDrop(dragData as ITreeNode, dropTarget);
    }

    // Clean up drag state
    this.endDrag();
  }

  /**
   * Add a new node to a parent (subfolders at top, items after)
   */
  addNode(node: ITreeNode, parent: ITreeNode): void {
    this.insertNodeSorted(node, parent);
    this.updateAndSave();
  }

  /**
   * Delete a node and optionally its children
   * @param node - The node to delete
   * @param deleteChildren - If true, deletes all children. If false, moves children to parent (default: true)
   */
  deleteNode(node: ITreeNode, deleteChildren = true): void {
    // Use reference-based lookup to avoid ID collision issues
    const parent = this.findParentByReference(node);
    if (!parent?.children) {
      // If no parent found, check if it's a root node
      const isRoot = this.items().some((rootNode) => rootNode === node);
      if (isRoot) {
        this.showError('Cannot delete root-level items');
        return;
      }

      this.showError('Node not found');
      return;
    }

    const nodeIndex = parent.children.indexOf(node);
    if (nodeIndex === -1) {
      return;
    }

    // If node has children and we don't want to delete them, move them to parent
    if (!deleteChildren && node.children?.length) {
      // Insert children at the position of the deleted node
      parent.children.splice(nodeIndex, 1, ...node.children);
    } else {
      parent.children.splice(nodeIndex, 1);
    }

    this.updateAndSave();
    this.showSuccess('Item deleted successfully');
  }

  /**
   * Rename a subfolder (droppable node) and optionally change its icon
   * @param node - The node to rename
   * @param newLabel - The new label for the node
   * @param newIcon - The new icon for the node (optional)
   */
  renameSubfolder(node: ITreeNode, newLabel: string, newIcon?: string): void {
    if (!newLabel?.trim()) {
      this.showError('Name cannot be empty');
      return;
    }

    // Use reference-based check
    if (!node.droppable) {
      this.showError('Only subfolders can be renamed');
      return;
    }

    const parent = this.findParentByReference(node);
    if (parent?.children) {
      // Check for duplicate names within the same parent
      const isDuplicate = parent.children.some(
        (child) => child !== node && child.label.toLowerCase() === newLabel.trim().toLowerCase(),
      );
      if (isDuplicate) {
        this.showError('A subfolder with this name already exists');
        return;
      }
    }

    // Mutate the object directly since we have the reference
    node.label = newLabel.trim();
    if (newIcon) {
      node.icon = newIcon;
    }
    this.updateAndSave();
    this.showSuccess('Subfolder updated successfully');
  }

  /**
   * Get flat node representation for backend sync
   */
  getFlatNodes(): FlatTreeNode[] {
    return TreeUtils.treeToFlatNodes(this.items());
  }

  // ============================================================================
  // Private - Drop Validation
  // ============================================================================

  private canDropTreeNode(treeNode: ITreeNode, targetNode: ITreeNode): boolean {
    // Use ID comparison since CDK may pass a copy, not the actual reference
    if (treeNode.id === targetNode.id || !treeNode.draggable) {
      return false;
    }

    // Get actual references from the tree for accurate descendant check
    const actualNode = TreeUtils.findNodeById(this.items(), treeNode.id);
    const actualTarget = TreeUtils.findNodeById(this.items(), targetNode.id);

    if (!actualNode || !actualTarget) {
      return false;
    }

    if (TreeUtils.isDescendant(this.parentMap(), actualNode, actualTarget)) {
      return false;
    }

    // Duplicate check moved to handleTreeNodeDrop where error message is shown
    const nodeType = this.getNodeType(actualNode);
    return actualTarget.type === nodeType;
  }

  private canDropEntity(entity: DraggedEntityData, targetNode: ITreeNode): boolean {
    // Only check type match - duplicate check happens in handleEntityDrop with error message
    return entity.type === targetNode.type;
  }

  private getNodeType(node: ITreeNode): EntityIds | undefined {
    if (node.type) {
      return node.type;
    }
    // If node has no type, get it from its parent
    const parent = this.parentMap().get(node);
    return parent?.type;
  }

  // ============================================================================
  // Private - Drop Handlers
  // ============================================================================

  private handleEntityDrop(draggedItem: DraggedEntityData, targetNode?: ITreeNode): void {
    if (!targetNode) {
      this.showError('Please drop on a folder');
      return;
    }

    if (!targetNode.droppable) {
      this.showError('Cannot drop here - this is not a folder');
      return;
    }

    if (draggedItem.type !== targetNode.type) {
      this.showError(`Cannot drop ${draggedItem.type} into ${targetNode.type} list`);
      return;
    }

    // Build list of all entities to add (primary + additionalItems)
    const allEntities: { id: string; label: string }[] = [
      { id: draggedItem.id, label: draggedItem.label },
      ...(draggedItem.additionalItems ?? []),
    ];

    let addedCount = 0;
    let skippedCount = 0;

    for (const entity of allEntities) {
      if (this.nodeExistsInParent(entity.id, targetNode)) {
        skippedCount++;
        continue;
      }

      const newNode = this.createNodeFromEntity({
        ...draggedItem,
        id: entity.id,
        label: entity.label,
      });
      this.insertNodeSorted(newNode, targetNode);
      addedCount++;
    }

    if (addedCount > 0) {
      targetNode.expanded = true;
      this.updateAndSave();
    }

    // Show appropriate toast
    if (addedCount === 0) {
      this.showError(
        allEntities.length === 1
          ? 'This item is already in this folder'
          : 'All items are already in this folder',
      );
    } else if (allEntities.length === 1) {
      this.showSuccess(`Added "${draggedItem.label}" to "${targetNode.label}"`);
    } else {
      const msg = `Added ${addedCount} item${addedCount > 1 ? 's' : ''} to "${targetNode.label}"`;
      const skippedMsg =
        skippedCount > 0
          ? ` (${skippedCount} duplicate${skippedCount > 1 ? 's' : ''} skipped)`
          : '';
      this.showSuccess(msg + skippedMsg);
    }
  }

  private handleTreeNodeDrop(treeNode: ITreeNode, dropTarget?: ITreeNode): void {
    // Validate drop with error messages
    if (!dropTarget) {
      this.showError('Please drop on a folder');
      return;
    }
    if (!treeNode?.draggable) {
      this.showError('This item cannot be moved');
      return;
    }
    if (!dropTarget.droppable) {
      this.showError('Cannot drop here - this is not a folder');
      return;
    }
    if (treeNode.id === dropTarget.id) {
      this.showError('Cannot drop item onto itself');
      return;
    }

    // Always use ID-based lookup to handle reference mismatches from CDK drag-drop
    const actualNode = TreeUtils.findNodeById(this.items(), treeNode.id);
    const actualTarget = TreeUtils.findNodeById(this.items(), dropTarget!.id);

    if (!actualNode || !actualTarget) {
      this.showError('Item not found');
      return;
    }

    // Prevent dropping into self or descendants
    if (this.isNodeOrDescendant(actualTarget, actualNode)) {
      this.showError('Cannot drop a folder into itself or its children');
      return;
    }

    // Check if the item already exists in the target folder
    if (this.nodeExistsInParent(actualNode.id, actualTarget)) {
      this.showError('This item is already in this folder');
      return;
    }

    // Find source parent using the computed parent map (more reliable with signals)
    const sourceParent = this.findParentNode(actualNode);
    if (!sourceParent?.children) {
      this.showError('Cannot find source location');
      return;
    }

    // Remove from source
    const fromIndex = sourceParent.children.findIndex((c) => c.id === actualNode.id);
    if (fromIndex === -1) {
      this.showError('Item not found in source');
      return;
    }
    sourceParent.children.splice(fromIndex, 1);

    // Add to target (subfolders at top, items after)
    if (!actualTarget.children) {
      actualTarget.children = [];
    }

    this.insertNodeSorted(actualNode, actualTarget);
    actualTarget.expanded = true;
    this.updateAndSave();
    this.showSuccess(`Moved "${actualNode.label}" to "${actualTarget.label}"`);
  }

  /**
   * Find the parent of a node by searching through the tree
   * Uses direct tree traversal to ensure we find the actual parent reference
   */
  findParentNode(node: ITreeNode): ITreeNode | undefined {
    // Delegate to reference-based lookup if possible, otherwise use ID matching
    // But since this method signature takes ITreeNode, we should prefer reference lookup for correctness with duplicates
    return this.findParentByReference(node) ?? this.findParentNodeById(node.id);
  }

  /**
   * Find parent by exact object reference
   */
  private findParentByReference(targetNode: ITreeNode): ITreeNode | undefined {
    const searchParent = (nodes: ITreeNode[]): ITreeNode | undefined => {
      for (const current of nodes) {
        // Check if this node's children contain our target instance
        if (current.children?.includes(targetNode)) {
          return current;
        }
        // Recursively search children
        if (current.children?.length) {
          const found = searchParent(current.children);
          if (found) return found;
        }
      }
      return undefined;
    };
    return searchParent(this.items());
  }

  /**
   * Find the parent of a node by searching through the tree using IDs
   */
  private findParentNodeById(nodeId: string): ITreeNode | undefined {
    const searchParent = (nodes: ITreeNode[]): ITreeNode | undefined => {
      for (const current of nodes) {
        // Check if this node's children contain our target
        if (current.children?.some((child) => child.id === nodeId)) {
          return current;
        }
        // Recursively search children
        if (current.children?.length) {
          const found = searchParent(current.children);
          if (found) return found;
        }
      }
      return undefined;
    };
    return searchParent(this.items());
  }

  /**
   * Check if target is the node itself or a descendant of the node
   */
  private isNodeOrDescendant(target: ITreeNode, node: ITreeNode): boolean {
    if (target.id === node.id) {
      return true;
    }
    return TreeUtils.isDescendant(this.parentMap(), node, target);
  }

  /**
   * Insert a node into parent's children with subfolders at top
   */
  private insertNodeSorted(node: ITreeNode, parent: ITreeNode): void {
    if (!parent.children) {
      parent.children = [];
    }

    if (node.droppable) {
      parent.children.unshift(node);
    } else {
      const firstItemIndex = parent.children.findIndex((child) => !child.droppable);
      const insertIndex = firstItemIndex === -1 ? parent.children.length : firstItemIndex;
      parent.children.splice(insertIndex, 0, node);
    }
  }

  // ============================================================================
  // Private - Node Operations
  // ============================================================================

  private nodeExistsInParent(nodeId: string, parent: ITreeNode): boolean {
    return !!parent.children?.some((child) => child.id === nodeId);
  }

  private createNodeFromEntity(entity: DraggedEntityData): ITreeNode {
    return {
      id: entity.id,
      label: entity.label,
      icon: ENTITY_TYPE_ICONS[entity.type] || DEFAULT_ICON,
      draggable: true,
      droppable: false,
      type: entity.type,
      link: `/${entity.type}/profile/${entity.id}`,
    };
  }

  // ============================================================================
  // Private - State Management
  // ============================================================================

  private updateAndSave(): void {
    this.items.set([...this.items()]);
    this.saveToStorage();
  }

  private saveToStorage(): void {
    try {
      const flatNodes = TreeUtils.treeToFlatNodes(this.items());
      const state: StoredTreeState = {
        version: TREE_STORAGE_VERSION,
        nodes: flatNodes,
      };
      localStorage.setItem(TREE_STORAGE_KEY, JSON.stringify(state));
      // this.syncToBackend(flatNodes);
    } catch (error) {
      console.error('Failed to save tree state:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(TREE_STORAGE_KEY);
      if (!stored) return;

      const state: StoredTreeState = JSON.parse(stored);
      if (state.version !== TREE_STORAGE_VERSION || !state.nodes) return;

      const treeItems = TreeUtils.flatNodesToTree(state.nodes);
      if (treeItems.length > 0) {
        // Deduplicate to fix any corrupted data with duplicate IDs
        const deduplicatedItems = TreeUtils.deduplicateTree(treeItems);
        this.items.set(deduplicatedItems);
      }
    } catch (error) {
      console.error('Failed to load tree state:', error);
    }
  }

  // /**
  //  * Stub for backend synchronization
  //  * @param flatNodes - Flat nodes ready for database storage
  //  */
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // private syncToBackend(flatNodes: FlatTreeNode[]): void {
  //   // TODO: Implement actual API call
  //   // return this.http.post('/api/tree-nodes', flatNodes);
  // }

  // ============================================================================
  // Private - Notifications
  // ============================================================================

  private showError(detail: string): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail });
  }

  private showSuccess(detail: string): void {
    this.messageService.add({ severity: 'success', summary: 'Success', detail });
  }

  // ============================================================================
  // Private - Auto-expand Timer
  // ============================================================================

  /**
   * Start timer to auto-expand a folder after delay
   */
  private startExpandTimer(node: ITreeNode): void {
    this.cancelExpandTimer();
    this.expandTimer = setTimeout(() => {
      // Find the actual node in the tree and expand it
      const actualNode = TreeUtils.findNodeById(this.items(), node.id);
      if (actualNode && actualNode.children?.length && !actualNode.expanded) {
        actualNode.expanded = true;
        this.items.set([...this.items()]);
      }
    }, this.EXPAND_DELAY);
  }

  /**
   * Cancel the auto-expand timer
   */
  private cancelExpandTimer(): void {
    if (this.expandTimer) {
      clearTimeout(this.expandTimer);
      this.expandTimer = null;
    }
  }
}

// Re-export commonly used types for convenience
export type {
  EntityType,
  DraggedEntityData,
  ITreeNode,
  FlatTreeNode,
  DropListData,
} from '../models';

// Backwards compatibility alias
export type DraggedData = DraggedEntityData;
