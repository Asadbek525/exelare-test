import { Injectable, signal } from '@angular/core';
import { TreeNode } from 'primeng/api';

export interface DroppedItem {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  visible = signal(true);

  menuItems = signal<TreeNode<string>[]>([
    {
      draggable: false,
      droppable: false,
      key: '1',
      label: 'Saved Lists',
      data: 'Saved Lists Folder',
      icon: 'pi pi-fw pi-folder',
      children: [
        {
          draggable: false,
          droppable: true,
          key: '1-1',
          label: 'Companies',
          data: 'Companies List',
          icon: 'pi pi-fw pi-building',
        },
        {
          draggable: false,
          droppable: true,
          key: '1-2',
          label: 'Contacts',
          data: 'Contacts List',
          icon: 'pi pi-fw pi-users',
        },
        {
          draggable: false,
          droppable: true,
          key: '1-3',
          label: 'Candidates',
          data: 'Candidates List',
          icon: 'pi pi-fw pi-user',
        },
        {
          draggable: false,
          droppable: true,
          key: '1-4',
          label: 'Jobs',
          data: 'Jobs List',
          icon: 'pi pi-fw pi-briefcase',
        },
      ],
    },
  ]);

  toggle() {
    this.visible.update((v) => !v);
  }

  /**
   * Add an item to a specific list by key
   * @returns true if added successfully, false if duplicate exists
   */
  addItemToList(listKey: string, item: DroppedItem): boolean {
    const currentItems = this.menuItems();
    const listNode = this.findNodeByKey(currentItems, listKey);

    if (!listNode) {
      return false;
    }

    // Check for duplicate
    const children = listNode.children || [];
    const isDuplicate = children.some((child) => child.data === item.id);
    if (isDuplicate) {
      return false;
    }

    // Create new child node
    const newChild: TreeNode<string> = {
      key: `${listKey}-item-${item.id}`,
      label: item.name,
      data: item.id,
      icon: 'pi pi-fw pi-user',
      draggable: true,
      droppable: false,
    };

    // Update the tree with new child
    const updatedItems = this.updateNodeChildren(currentItems, listKey, [...children, newChild]);
    this.menuItems.set(updatedItems);
    return true;
  }

  private findNodeByKey(nodes: TreeNode[], key: string): TreeNode | null {
    for (const node of nodes) {
      if (node.key === key) {
        return node;
      }
      if (node.children) {
        const found = this.findNodeByKey(node.children, key);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  private updateNodeChildren(nodes: TreeNode[], key: string, newChildren: TreeNode[]): TreeNode[] {
    return nodes.map((node) => {
      if (node.key === key) {
        return { ...node, children: newChildren, expanded: true };
      }
      if (node.children) {
        return { ...node, children: this.updateNodeChildren(node.children, key, newChildren) };
      }
      return node;
    });
  }
}
