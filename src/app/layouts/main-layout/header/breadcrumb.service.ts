import { Injectable, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
const homeItem: MenuItem = { label: 'Exelare', routerLink: '/' };
@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private readonly _breadcrumbItems = signal<MenuItem[]>([homeItem]);

  getBreadcrumbItems() {
    return this._breadcrumbItems;
  }

  set breadcrumbItems(items: MenuItem[]) {
    this._breadcrumbItems.set([homeItem, ...items]);
  }

  pushItems(items: MenuItem[]) {
    this._breadcrumbItems.update((value) => [...value, ...items]);
  }

  push(item: MenuItem) {
    this._breadcrumbItems.update((value) => [...value, item]);
  }
}
