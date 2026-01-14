import { Component, output, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { OrderList } from 'primeng/orderlist';
import { PrimeTemplate } from 'primeng/api';
import { DEFAULT_TABS, TabConfig, TABS_STORAGE_KEY } from '../tab-config.model';

@Component({
  selector: 'app-customize-tabs-dialog',
  standalone: true,
  imports: [Dialog, Button, Checkbox, OrderList, FormsModule, PrimeTemplate],
  templateUrl: './customize-tabs-dialog.html',
})
export class CustomizeTabsDialog {
  visible = model<boolean>(false);
  tabs = model.required<TabConfig[]>();
  saved = output<TabConfig[]>();

  reorderTabs() {
    const currentTabs = this.tabs();
    const updatedTabs = currentTabs.map((tab, index) => ({ ...tab, order: index }));
    this.tabs.set(updatedTabs);
  }

  toggleTabVisibility(tabId: string, visible: boolean) {
    const currentTabs = this.tabs();
    const updatedTabs = currentTabs.map((tab) => (tab.id === tabId ? { ...tab, visible } : tab));
    this.tabs.set(updatedTabs);
  }

  resetToDefaults() {
    this.tabs.set(structuredClone(DEFAULT_TABS));
  }

  save() {
    const currentTabs = this.tabs();
    const updatedTabs = currentTabs.map((tab, index) => ({ ...tab, order: index }));
    this.tabs.set(updatedTabs);
    localStorage.setItem(TABS_STORAGE_KEY, JSON.stringify(updatedTabs));
    this.saved.emit(updatedTabs);
    this.visible.set(false);
  }

  cancel() {
    this.visible.set(false);
  }
}
