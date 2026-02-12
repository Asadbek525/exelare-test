import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { filter, map } from 'rxjs';
import { MenuStore } from '../../../core/store/menu.store';
import { TreeUtils } from '../../../shared/components/tree/utils/tree.utils';

const HOME_ITEM: MenuItem = { label: 'Exelare', routerLink: '/' };

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private readonly router = inject(Router);
  private readonly menuStore = inject(MenuStore);

  /** Reactive current URL signal */
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  /** Auto-generated breadcrumb items derived from sidebar tree + current URL */
  readonly items = computed<MenuItem[]>(() => {
    const url = this.currentUrl();
    const menuItems = this.menuStore.menuItems();
    const trail = TreeUtils.findNodeTrail(menuItems, url);
    const crumbs: MenuItem[] = trail.map((node) => ({
      label: node.label,
      icon: node.icon,
      routerLink: node.link,
    }));

    return [HOME_ITEM, ...crumbs];
  });
}
