import { Component, effect, inject } from '@angular/core';
import { DragService, Tree } from '../../../shared/components/tree';
import { MenuStore } from '../../../core/store/menu.store';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [Tree],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  private readonly menuStore = inject(MenuStore);
  private readonly dragService = inject(DragService);

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
}
