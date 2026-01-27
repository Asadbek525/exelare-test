import { Component, computed, inject, input } from '@angular/core';
import { ITreeNode } from '../tree';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { DragService } from '../drag-service';

@Component({
  selector: 'app-tree-node',
  imports: [],
  templateUrl: './tree-node.html',
  styleUrl: './tree-node.css',
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

  dragEntered(dragEvent: DragEvent) {
    dragEvent.preventDefault();
  }
  dragLeft(dragEvent: DragEvent) {
    dragEvent.preventDefault();
    this.dragService.setCurrentNode(null);
  }

  item = input.required<ITreeNode>();
  protected readonly isDragOver = computed(() => {
    return this.item().label === this.dragService.currentNode()?.label;
  });

  protected async toggle() {
    if (this.item().link) {
      await this.router.navigate([this.item().link]);
      this.item().selected = true;
    }
    if (!this.item().children) return;
    this.item().expanded = !this.item().expanded;
  }

  protected drop(dragEvent: DragEvent) {
    dragEvent.preventDefault();
    this.dragService.drop(dragEvent);
  }

  protected dragOver(dragEvent: DragEvent) {
    dragEvent.preventDefault();
    this.dragService.setCurrentNode(this.item());
  }
}
