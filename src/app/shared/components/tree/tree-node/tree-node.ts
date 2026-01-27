import { Component, input } from '@angular/core';
import { ITreeNode } from '../tree';
import { trigger, state, style, transition, animate } from '@angular/animations';

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
  item = input.required<ITreeNode>();

  protected toggle() {
    this.item().expanded = !this.item().expanded;
  }
}
