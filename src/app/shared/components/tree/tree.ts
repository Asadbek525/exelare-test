import { Component } from '@angular/core';
import { it } from 'vitest';
import { TreeNode } from './tree-node/tree-node';

export interface ITreeNode {
  label: string;
  icon: string;
  expanded?: boolean;
  children?: ITreeNode[];
}

@Component({
  selector: 'app-tree',
  templateUrl: './tree.html',
  styleUrl: './tree.css',
  imports: [TreeNode],
})
export class Tree {
  items: ITreeNode[] = [
    {
      label: 'Saved lists',
      icon: 'pi pi-fw pi-list',
      children: [
        {
          label: 'Companies',
          icon: 'pi pi-fw pi-building',
        },
        {
          label: 'Contacts',
          icon: 'pi pi-fw pi-user',
        },
        {
          label: 'Candidates',
          icon: 'pi pi-fw pi-user',
        },
        {
          label: 'Jobs',
          icon: 'pi pi-fw pi-briefcase',
        },
      ],
    },
  ];
  protected readonly it = it;
}
