import { Injectable } from '@angular/core';
import { ContextMenu } from 'primeng/contextmenu';

@Injectable({
  providedIn: 'root',
})
export class ContextMenuService {
  private activeMenu: ContextMenu | null = null;

  /**
   * Register a context menu as active and close any previously active menu
   */
  setActiveMenu(menu: ContextMenu): void {
    if (this.activeMenu && this.activeMenu !== menu) {
      this.activeMenu.hide();
    }
    this.activeMenu = menu;
  }

  /**
   * Clear the active menu reference
   */
  clearActiveMenu(menu: ContextMenu): void {
    if (this.activeMenu === menu) {
      this.activeMenu = null;
    }
  }
}
