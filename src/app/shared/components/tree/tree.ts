import { Component, inject } from '@angular/core';
import { TreeNode } from './tree-node/tree-node';
import { DragService } from './services/drag-service';

// Re-export ITreeNode for backwards compatibility
export type { ITreeNode } from './models';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.html',
  styleUrl: './tree.css',
  imports: [TreeNode],
})
export class Tree {
  private readonly dragService = inject(DragService);
  readonly items = this.dragService.items;
}
