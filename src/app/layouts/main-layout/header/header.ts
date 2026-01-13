import { Component, inject } from '@angular/core';
import { BreadcrumbService } from './breadcrumb.service';
import { Breadcrumb } from 'primeng/breadcrumb';
import { HeaderActionsService } from './header-actions.service';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.css',
  imports: [Breadcrumb, Button],
})
export class Header {
  private readonly breadcrumb = inject(BreadcrumbService);
  private readonly headerActions = inject(HeaderActionsService);
  protected breadcrumbItems = this.breadcrumb.getBreadcrumbItems();
  protected headerActionsItems = this.headerActions.getActions();
}
