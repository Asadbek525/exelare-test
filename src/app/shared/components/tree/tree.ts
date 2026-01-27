import { Component, inject } from '@angular/core';
import { TreeNode } from './tree-node/tree-node';
import { DragService } from './drag-service';

export interface ITreeNode {
  label: string;
  icon: string;
  expanded?: boolean;
  children?: ITreeNode[];
  draggable?: boolean;
  droppable?: boolean;
  selected?: boolean;
  link?: string;
  active?: boolean;
  type?: 'candidate' | 'contact' | 'job' | 'company';
}

@Component({
  selector: 'app-tree',
  templateUrl: './tree.html',
  styleUrl: './tree.css',
  imports: [TreeNode],
})
export class Tree {
  private readonly dragService = inject(DragService);
  readonly items = this.dragService.items;
  currentItem = this.dragService.currentNode;
}
