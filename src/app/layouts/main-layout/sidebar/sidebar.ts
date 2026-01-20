import { Component, inject, model, signal } from '@angular/core';
import { SidebarService } from './sidebar.service';
import { Tree, TreeNodeDropEvent, TreeNodeSelectEvent } from 'primeng/tree';
import { MenuItem, MessageService, TreeDragDropService, TreeNode } from 'primeng/api';
import { ContextMenu } from 'primeng/contextmenu';

@Component({
  selector: 'app-sidebar',
  imports: [Tree, ContextMenu],
  providers: [TreeDragDropService],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  sidebarService = inject(SidebarService);
  messageService = inject(MessageService);

  protected isDragOver = signal(false);
  protected dragOverNodeKey = signal<string | null>(null);

  protected contextMenuItems: MenuItem[] = [
    { label: 'View', icon: 'pi pi-search', command: () => this.viewFile(this.contextMenuNode()) },
    { label: 'Toggle', icon: 'pi pi-sort', command: () => this.toggleFile(this.contextMenuNode()) },
  ];
  contextMenuNode = model<TreeNode | null>(null);

  viewFile(node: TreeNode | null) {
    if (node) {
      this.messageService.add({ severity: 'info', summary: 'File Selected', detail: node.label });
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

  protected nodeDropped($event: TreeNodeDropEvent) {
    console.log($event);
    console.log(this.sidebarService.menuItems());
  }

  protected nodeSelected($event: TreeNodeSelectEvent) {
    console.log('node selected');
    console.log($event);
  }

  // External drag-drop handlers for candidate cards
  protected onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }

    this.isDragOver.set(true);

    // Find the target tree node from the DOM element
    const targetKey = this.findTargetNodeKey(event.target as HTMLElement);
    this.dragOverNodeKey.set(targetKey);
  }

  protected onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    // Only reset if we're leaving the sidebar entirely
    const relatedTarget = event.relatedTarget as HTMLElement;
    const sidebar = event.currentTarget as HTMLElement;

    if (!relatedTarget || !sidebar.contains(relatedTarget)) {
      this.isDragOver.set(false);
      this.dragOverNodeKey.set(null);
    }
  }

  protected onExternalDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.isDragOver.set(false);
    this.dragOverNodeKey.set(null);

    if (!event.dataTransfer) {
      return;
    }

    const data = event.dataTransfer.getData('application/json');
    if (!data) {
      return;
    }

    try {
      const candidate = JSON.parse(data) as { id: string; name: string };
      const targetKey = this.findTargetNodeKey(event.target as HTMLElement);

      if (!targetKey) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Invalid Drop Target',
          detail: 'Please drop on a specific list (Companies, Contacts, Candidates, or Jobs)',
        });
        return;
      }

      const success = this.sidebarService.addItemToList(targetKey, candidate);

      if (success) {
        const listNode = this.findListLabel(targetKey);
        this.messageService.add({
          severity: 'success',
          summary: 'Added to List',
          detail: `${candidate.name} added to ${listNode}`,
        });
      } else {
        this.messageService.add({
          severity: 'info',
          summary: 'Already Exists',
          detail: `${candidate.name} is already in this list`,
        });
      }
    } catch (e) {
      console.error('Failed to parse dropped data', e);
    }
  }

  private findTargetNodeKey(element: HTMLElement | null): string | null {
    if (!element) {
      return null;
    }

    // Traverse up the DOM to find the tree node element
    let current: HTMLElement | null = element;
    while (current) {
      // PrimeNG Tree uses data attributes or we can check for treenode class
      const treeNode = current.closest('[data-p-section="treenode"]') as HTMLElement;
      if (treeNode) {
        // Try to find the node by its label text
        const labelElement = treeNode.querySelector('.p-tree-node-label');
        if (labelElement) {
          const label = labelElement.textContent?.trim();
          return this.findKeyByLabel(label);
        }
      }

      // Also check for p-treenode class (older PrimeNG versions)
      if (current.classList?.contains('p-tree-node')) {
        const labelElement = current.querySelector('.p-tree-node-label');
        if (labelElement) {
          const label = labelElement.textContent?.trim();
          return this.findKeyByLabel(label);
        }
      }

      current = current.parentElement;
    }

    return null;
  }

  private findKeyByLabel(label: string | undefined | null): string | null {
    if (!label) {
      return null;
    }

    const labelToKeyMap: Record<string, string> = {
      Companies: '1-1',
      Contacts: '1-2',
      Candidates: '1-3',
      Jobs: '1-4',
    };

    return labelToKeyMap[label] || null;
  }

  private findListLabel(key: string): string {
    const keyToLabelMap: Record<string, string> = {
      '1-1': 'Companies',
      '1-2': 'Contacts',
      '1-3': 'Candidates',
      '1-4': 'Jobs',
    };

    return keyToLabelMap[key] || 'Unknown List';
  }
}
