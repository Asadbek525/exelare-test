import { computed, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { ITreeNode } from './tree';
import { MessageService } from 'primeng/api';
import { Candidate } from '../../../features/candidates/models/candidate.model';

export interface DraggedData extends Candidate {
  type?: string;
}

@Injectable({
  providedIn: 'root',
})
export class DragService {
  messageService = inject(MessageService);
  currentNode = signal<ITreeNode | null>(null);
  draggedData = signal<DraggedData | null>(null);
  items: WritableSignal<ITreeNode[]> = signal([
    {
      id: 'saved-lists',
      label: 'Saved lists',
      icon: 'pi pi-fw pi-list',
      expanded: true,
      children: [
        {
          id: 'companies',
          label: 'Companies',
          icon: 'pi pi-fw pi-building',
          draggable: false,
          droppable: true,
        },
        {
          id: 'contacts',
          label: 'Contacts',
          icon: 'pi pi-fw pi-user',
          draggable: false,
          droppable: true,
        },
        {
          id: 'candidates',
          label: 'Candidates',
          icon: 'pi pi-fw pi-user',
          draggable: false,
          droppable: true,
          type: 'candidate',
          link: '/candidates',
        },
        {
          id: 'jobs',
          label: 'Jobs',
          icon: 'pi pi-fw pi-briefcase',
          draggable: false,
          droppable: true,
        },
      ],
    },
  ]);
  parentMap = computed(() => {
    const map = new Map<ITreeNode, ITreeNode>();
    const items = [...this.items()];
    items.forEach((item) => {
      if (item.children) {
        item.children.forEach((item1) => {
          map.set(item1, item);
          items.push(item1);
        });
      }
    });
    return map;
  });

  setCurrentNode(node: ITreeNode | null) {
    while (node && node.droppable === false) {
      node = this.parentMap().get(node) ?? null;
    }
    this.currentNode.set(node);
  }

  drop(dragEvent: DragEvent) {
    const item = this.currentNode();
    this.currentNode.set(null);
    if (!item) {
      return;
    }
    const data = dragEvent.dataTransfer?.getData('application/json');
    if (data) {
      const draggedItem = this.draggedData();
      if (draggedItem && draggedItem.type === item.type) {
        if (item.children?.find((item) => item.label === draggedItem.FullName)) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'This item is already in the tree',
          });
          return;
        } else {
          this.items.update((items) => {
            if (item.children) {
              item.children.push({
                id: draggedItem.ConsIntID,
                label: draggedItem.FullName,
                icon: 'pi pi-fw pi-user',
                draggable: true,
                droppable: false,
                link: '/candidates/' + draggedItem.ConsIntID,
              });
            } else {
              item.children = [
                {
                  id: draggedItem.ConsIntID,
                  label: draggedItem.FullName,
                  icon: 'pi pi-fw pi-user',
                  draggable: true,
                  droppable: false,
                  link: '/candidates/' + draggedItem.ConsIntID,
                },
              ];
            }
            return items;
          });
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Item added successfully',
          });
        }
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Cannot drop this item here',
        });
      }
    }
  }

  addNode(node: ITreeNode, parent: ITreeNode) {
    if (parent.children) {
      parent.children.unshift(node);
    } else {
      parent.children = [node];
    }
    this.items.update((items) => [...items]);
  }
}
