import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  readonly collapsed = signal(false);
  readonly menuOpen = signal(false);
  readonly dialogOpen = signal(false);

  toggle() {
    this.collapsed.update((v: boolean) => !v);
  }
}
