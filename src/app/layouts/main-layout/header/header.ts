import { Component, HostListener, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NewButtonComponent } from '../../../shared/components/new-button/new-button';
import { BreadcrumbService } from './breadcrumb.service';
import { Breadcrumb } from 'primeng/breadcrumb';
import { GlobalSearchDialogComponent } from './global-search-dialog/global-search-dialog.component';
import { SidebarService } from '../sidebar/sidebar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.css',
  imports: [FormsModule, NewButtonComponent, GlobalSearchDialogComponent, Breadcrumb],
})
export class Header {
  private readonly breadcrumb = inject(BreadcrumbService);
  private readonly sidebarService = inject(SidebarService);
  protected breadcrumbItems = this.breadcrumb.getBreadcrumbItems();

  /** Search dialog visibility */
  readonly searchDialogVisible = signal(false);

  /** Keyboard shortcut listener (Cmd/Ctrl + K) */
  @HostListener('document:keydown', ['$event'])
  handleKeyboardShortcut(event: KeyboardEvent): void {
    // Cmd+K (Mac) or Ctrl+K (Windows/Linux)
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      this.openSearch();
    }
  }

  /** Open search dialog */
  openSearch(): void {
    this.searchDialogVisible.set(true);
  }

  toggleSidebar(): void {
    this.sidebarService.toggle();
  }

  /** Check if current OS is Mac */
  get isMac(): boolean {
    return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  }

  /** Get shortcut display text */
  get shortcutText(): string {
    return this.isMac ? '⌘ + K' : 'Ctrl+K';
  }
}
