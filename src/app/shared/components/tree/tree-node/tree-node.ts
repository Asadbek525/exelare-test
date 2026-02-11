import { Component, computed, inject, input, signal, ViewEncapsulation } from '@angular/core';
import { ITreeNode } from '../tree';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { DragService, DropListData } from '../services/drag.service';
import { Menu } from 'primeng/menu';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { CreateSublistDialog, SublistData } from './create-sublist-dialog/create-sublist-dialog';
import {
  RenameSubfolderData,
  RenameSubfolderDialog,
} from './rename-subfolder-dialog/rename-subfolder-dialog';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragEnter,
  CdkDragPlaceholder,
  CdkDragPreview,
  CdkDragStart,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { Tooltip } from 'primeng/tooltip';
import { SidebarService } from '../../../../layouts/main-layout/sidebar/sidebar.service';

@Component({
  selector: 'app-tree-node',
  imports: [
    CreateSublistDialog,
    RenameSubfolderDialog,
    CdkDrag,
    CdkDropList,
    CdkDragPreview,
    CdkDragPlaceholder,
    Menu,
    Tooltip,
  ],
  templateUrl: './tree-node.html',
  styleUrl: './tree-node.css',
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({ height: '0', opacity: '0', overflow: 'hidden' })),
      state('expanded', style({ height: '*', opacity: '1' })),
      transition('collapsed <=> expanded', [animate('200ms ease-in-out')]),
    ]),
    trigger('rotateIcon', [
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(90deg)' })),
      transition('collapsed <=> expanded', [animate('200ms ease-in-out')]),
    ]),
  ],
})
export class TreeNode {
  readonly router = inject(Router);
  readonly dragService = inject(DragService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly sidebarService = inject(SidebarService);

  item = input.required<ITreeNode>();
  collapsed = input(false);
  protected showCreateDialog = signal(false);
  protected showRenameDialog = signal(false);

  protected menuItems = computed<MenuItem[]>(() => {
    const items: MenuItem[] = [];
    const currentItem = this.item();

    // Only show "Create sublist" for droppable nodes (folders)
    if (currentItem.droppable) {
      items.push({
        label: 'Create a new sublist',
        icon: 'pi pi-fw pi-plus',
        command: () => {
          this.updateDialogVisibility(true, 'create');
        },
      });

      items.push({
        label: 'Rename',
        icon: 'pi pi-fw pi-pencil',
        command: () => {
          this.updateDialogVisibility(true, 'rename');
        },
      });
    }

    // Show delete option for draggable nodes (not root items)
    if (currentItem.draggable) {
      if (items.length > 0) {
        items.push({ separator: true });
      }

      items.push({
        label: 'Delete',
        icon: 'pi pi-fw pi-trash',
        command: () => {
          this.confirmDelete();
        },
      });
    }

    return items;
  });

  /** Check if this node is currently being hovered with valid drop */
  protected isHovered = computed(() => {
    const hovered = this.dragService.hoveredTarget();
    return hovered?.id === this.item().id;
  });

  /** Show folder highlight (drop into) - only when valid */
  protected showDropInto = computed(() => {
    return this.isHovered() && this.dragService.dropPosition() === 'into' && !this.isInvalidDrop();
  });

  /** Check if this is an invalid drop (duplicate item) */
  protected isInvalidDrop = computed(() => {
    if (!this.isHovered()) return false;
    const dragged = this.dragService.draggedItem();
    if (!dragged) return false;
    // Check if dragged item already exists in this folder
    return this.item().children?.some((child) => child.id === dragged.id) ?? false;
  });

  /**
   * Get or initialize children array - ensures we always have a reference
   */
  protected getChildren(): ITreeNode[] {
    const currentItem = this.item();
    if (!currentItem.children) {
      currentItem.children = [];
    }
    return currentItem.children;
  }

  protected onSublistCreated(data: SublistData) {
    const node: ITreeNode = {
      id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      label: data.label,
      icon: data.icon,
      draggable: true,
      droppable: true,
      expanded: false,
      type: this.item().type,
    };
    this.dragService.addNode(node, this.item());
  }

  protected onRenamed(data: RenameSubfolderData) {
    this.dragService.renameSubfolder(this.item(), data.label, data.icon);
  }

  protected confirmDelete() {
    const currentItem = this.item();
    const hasChildren = currentItem.children && currentItem.children.length > 0;

    this.confirmationService.confirm({
      message: hasChildren
        ? `Are you sure you want to delete "${currentItem.label}" and all its contents?`
        : `Are you sure you want to delete "${currentItem.label}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.dragService.deleteNode(currentItem);
      },
    });
  }

  protected async toggle() {
    if (!this.item().children) return;
    this.item().expanded = !this.item().expanded;
  }

  protected onDragStarted(event: CdkDragStart) {
    this.dragService.startDrag(event.source.data);
  }

  protected onDragEnded() {
    this.dragService.endDrag();
  }

  protected onDragEnter(event: CdkDragEnter) {
    // For external drags, startDrag was never called, so set it now
    if (!this.dragService.draggedItem()) {
      this.dragService.startDrag(event.item.data);
    }

    if (this.dragService.isValidDropTarget(this.item())) {
      this.dragService.setHoveredTarget(this.item());
      // Default to 'into' position - CDK doesn't fire native dragover events
      this.dragService.setDropPosition('into');
    }
  }

  protected onDragLeave() {
    if (this.dragService.hoveredTarget()?.id === this.item().id) {
      this.dragService.setHoveredTarget(null);
      this.dragService.setDropPosition(null);
    }
  }

  protected onDrop(event: CdkDragDrop<DropListData, unknown>) {
    event.event?.stopPropagation();
    // Use handleDrop which extracts drag data from the CDK event
    // This is more reliable than using draggedItem() signal which may be cleared
    this.dragService.handleDrop(event, this.item());
  }

  protected canDrop = (drag: CdkDrag, drop: CdkDropList<DropListData>): boolean => {
    return this.dragService.canDrop(drag, drop);
  };

  protected async navigate() {
    if (this.item().link) {
      await this.router.navigate([this.item().link]);
    }
    if (this.item().children?.length) this.item().expanded = true;
  }

  /**
   * Check if text content is overflowed (truncated with ellipsis)
   */
  protected isTextOverflowed(element: HTMLElement) {
    return element.scrollWidth > element.clientWidth;
  }

  protected onMenuShow() {
    this.sidebarService.menuOpen.set(true);
  }

  protected onMenuHide() {
    this.sidebarService.menuOpen.set(false);
  }

  protected updateDialogVisibility(visible: boolean, dialog: 'create' | 'rename') {
    if (dialog === 'create') {
      this.showCreateDialog.set(visible);
    } else {
      this.showRenameDialog.set(visible);
    }
    this.sidebarService.dialogOpen.set(visible);
  }
}
