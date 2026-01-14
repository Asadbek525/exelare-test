import { Injectable, signal } from '@angular/core';
import { ButtonSeverity } from 'primeng/button';

export interface ActionItem {
  outlined?: boolean;
  label?: string;
  icon?: string;
  command: () => void;
  severity?: ButtonSeverity;
}

@Injectable({
  providedIn: 'root',
})
export class HeaderActionsService {
  private readonly _actions = signal<ActionItem[]>([]);

  getActions() {
    return this._actions;
  }

  set actions(items: ActionItem[]) {
    this._actions.set(items);
  }

  clearActions() {
    this._actions.set([]);
  }
  addAction(item: ActionItem) {
    this._actions.update((value) => [...value, item]);
  }
}
