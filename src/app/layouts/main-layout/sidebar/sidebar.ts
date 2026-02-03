import { Component } from '@angular/core';
import { Tree } from '../../../shared/components/tree';

@Component({
  selector: 'app-sidebar',
  imports: [Tree],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {}
