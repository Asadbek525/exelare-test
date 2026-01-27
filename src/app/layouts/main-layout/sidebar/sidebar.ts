import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Tree } from '../../../shared/components/tree/tree';

@Component({
  selector: 'app-sidebar',
  imports: [NgOptimizedImage, Tree],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {}
