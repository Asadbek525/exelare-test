import { Component } from '@angular/core';
import { Header } from './header/header';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './sidebar/sidebar';
import { CdkDropListGroup } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-main-layout',
  imports: [Header, RouterOutlet, Sidebar, CdkDropListGroup],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {}
