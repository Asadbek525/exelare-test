import { Component, computed, inject, model, signal } from '@angular/core';
import { SidebarService } from './sidebar.service';
import { Tree, TreeNodeDropEvent, TreeNodeSelectEvent } from 'primeng/tree';
import { MenuItem, MessageService, TreeDragDropService, TreeNode } from 'primeng/api';
import { ContextMenu } from 'primeng/contextmenu';
import { Router } from '@angular/router';

const CANDIDATES_LIST_KEY = '1-3';
const CANDIDATES_ITEM_PREFIX = '1-3-item-';

@Component({
  selector: 'app-sidebar',
  imports: [Tree, ContextMenu],
  providers: [TreeDragDropService],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  sidebarService = inject(SidebarService);
  router = inject(Router);
  private messageService = inject(MessageService);

  isValidDropTarget = signal(false);
  contextMenuNode = model<TreeNode | null>(null);

  protected contextMenuItems = computed<MenuItem[]>(() => {
    const node = this.contextMenuNode();
    const isSavedCandidate = node?.key?.startsWith(CANDIDATES_ITEM_PREFIX);

    const items: MenuItem[] = [
      { label: 'View', icon: 'pi pi-search', command: () => this.viewFile(node) },
      { label: 'Toggle', icon: 'pi pi-sort', command: () => this.toggleFile(node) },
    ];

    if (isSavedCandidate) {
      items.push({
        label: 'Remove',
        icon: 'pi pi-trash',
        command: () => this.removeFromSavedList(node),
      });
    }

    return items;
  });

  async viewFile(node: TreeNode | null) {
    if (node) {
      await this.router.navigate([`/candidates/${node.key}`]);
    }
  }

  toggleFile(node: TreeNode | null) {
    if (node) {
      this.sidebarService.menuItems.set(
        this.updateNodeInTree(this.sidebarService.menuItems(), node.key, {
          ...node,
          expanded: !node.expanded,
        }),
      );
    }
  }
  updateNodeInTree(nodes: TreeNode[], key: string | undefined, updatedNode: TreeNode): TreeNode[] {
    return nodes.map((n) => {
      if (n.key === key) {
        return updatedNode;
      }
      if (n.children) {
        return { ...n, children: this.updateNodeInTree(n.children, key, updatedNode) };
      }
      return n;
    });
  }

  protected nodeSelected(event: TreeNodeSelectEvent) {
    const node = event.node;
    // Navigate to candidate profile if it's a saved candidate
    if (node?.key?.startsWith(CANDIDATES_ITEM_PREFIX)) {
      this.router.navigate(['/candidates', node.data]);
    }
  }

  protected nodeDropped(event: TreeNodeDropEvent) {
    console.log('dropped node');
    console.log(event.dropNode);
    console.log('drag node');
    console.log(event.dragNode);
    console.log(event.index);
  }

  protected onDragOver(event: DragEvent) {
    event.preventDefault();

    // Check if we have candidate data being dragged
    const types = event.dataTransfer?.types || [];
    if (types.includes('application/json')) {
      // We'll accept drops anywhere in sidebar for candidates list
      // The actual validation happens in onExternalDrop
      this.isValidDropTarget.set(true);
      event.dataTransfer!.dropEffect = 'copy';
    } else {
      this.isValidDropTarget.set(false);
      event.dataTransfer!.dropEffect = 'none';
    }
  }

  protected onDragLeave(event: DragEvent) {
    // Only reset if leaving the sidebar entirely
    const relatedTarget = event.relatedTarget as HTMLElement;
    const sidebar = event.currentTarget as HTMLElement;
    if (!sidebar.contains(relatedTarget)) {
      this.isValidDropTarget.set(false);
    }
  }

  protected onExternalDrop(dragEvent: DragEvent) {
    dragEvent.preventDefault();
    this.isValidDropTarget.set(false);

    const data = dragEvent.dataTransfer?.getData('application/json');
    if (!data) {
      return;
    }

    try {
      const parsed = JSON.parse(data);

      // Validate it's a candidate type
      if (parsed.type !== 'candidate') {
        this.messageService.add({
          severity: 'error',
          summary: 'Cannot Drop',
          detail: 'Only candidates can be dropped here',
        });
        return;
      }

      // Add to saved candidates list
      const added = this.sidebarService.addItemToList(CANDIDATES_LIST_KEY, {
        id: parsed.ConsIntID,
        name: parsed.FullName || `${parsed.FirstName} ${parsed.LastName}`,
      });

      if (added) {
        this.messageService.add({
          severity: 'success',
          summary: 'Candidate Saved',
          detail: `${parsed.FullName || parsed.FirstName} added to saved candidates`,
        });
      } else {
        this.messageService.add({
          severity: 'warn',
          summary: 'Already Saved',
          detail: 'This candidate is already in your saved list',
        });
      }
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to process dropped item',
      });
    }
  }

  private removeFromSavedList(node: TreeNode | null) {
    if (!node?.key) return;

    const removed = this.sidebarService.removeItemFromList(CANDIDATES_LIST_KEY, node.key);
    if (removed) {
      this.messageService.add({
        severity: 'success',
        summary: 'Removed',
        detail: `${node.label} removed from saved candidates`,
      });
    }
  }
}
