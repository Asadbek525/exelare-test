import { Component, computed, effect, inject, signal } from '@angular/core';
import { DragService, Tree } from '../../../shared/components/tree';
import { MenuStore } from '../../../core/store/menu.store';
import { SidebarService } from './sidebar.service';

@Component({
  selector: 'app-sidebar',
  imports: [Tree],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
})
export class Sidebar {
  private readonly menuStore = inject(MenuStore);
  private readonly dragService = inject(DragService);
  private readonly sidebarService = inject(SidebarService);

  readonly collapsed = this.sidebarService.collapsed;
  readonly isHovered = signal(false);

  readonly isExpanded = computed(() => {
    return (
      !this.collapsed() ||
      this.isHovered() ||
      this.sidebarService.menuOpen() ||
      this.sidebarService.dialogOpen()
    );
  });

  constructor() {
    effect(() => {
      const items = this.menuStore.menuItems();
      // Only update if we have items, to avoid wiping out default state on initial load if auth is pending
      // However, if user is logged out, items might be empty.
      // For now, let's assume valid menu items means we should show them.
      if (items.length > 0) {
        this.dragService.setItems(items);
      }
    });
  }

  onMouseEnter() {
    if (this.collapsed()) {
      this.isHovered.set(true);
    }
  }

  onMouseLeave() {
    this.isHovered.set(false);
  }
}
