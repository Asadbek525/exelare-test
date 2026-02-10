import { computed, inject, Injectable } from '@angular/core';
import { MenuBuilderService } from '../services/menu-builder.service';
import { AuthStore } from './auth.store';
import { ITreeNode } from '../../shared/components/tree';

@Injectable({
  providedIn: 'root',
})
export class MenuStore {
  private readonly menuBuilder = inject(MenuBuilderService);
  private readonly authStore = inject(AuthStore);

  // Computed signal that derives the menu structure from the Auth User data
  // This automatically updates whenever the user logs in or data refreshes
  readonly menuItems = computed<ITreeNode[]>(() => {
    const user = this.authStore.user();
    if (!user) {
      return [];
    }
    return this.menuBuilder.buildMenu(user);
  });
}
