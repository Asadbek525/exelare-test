import { computed, Injectable, signal } from '@angular/core';
import { RestUserResponse } from '../dto/rest-user.dto';
import { addMinutes } from 'date-fns';
import { ElementCompact } from 'xml-js';

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  private _user = signal<RestUserResponse | undefined>(undefined);
  private _permissions = signal<ElementCompact | null>(null);
  private _logoutMessage = signal<string | undefined>(undefined);

  // Computed
  public readonly user = computed(() => this._user());
  public readonly isLoggedIn = computed(() => !!this._user());
  public readonly logoutMessage = computed(() => this._logoutMessage());

  // Actions
  setUser(user: RestUserResponse | undefined): void {
    if (user) {
      if (!user.entities) {
        user.entities = [];
      }
      // Save to local storage or session if needed, for now just memory
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
    this._user.set(user);
  }

  getUser(): RestUserResponse | undefined {
    return this._user();
  }

  setPermissions(perms: ElementCompact): void {
    this._permissions.set(perms);
  }

  setLogoutMessage(msg: string | undefined): void {
    this._logoutMessage.set(msg);
  }

  updExpDate(dateStr: string): void {
    const user = this._user();
    if (user) {
      this._user.set({ ...user, expireDate: dateStr });
      localStorage.setItem('currentUser', JSON.stringify(this._user()));
    }
  }

  generateNewExpireDate(minutes?: number): string {
    const sessionTimeoutMins = minutes ?? this._user()?.request?.sessionTimeoutMins ?? 20;
    return addMinutes(new Date(), sessionTimeoutMins).toISOString();
  }

  constructor() {
    // Restore from local storage on init
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        this._user.set(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to restore user', e);
      }
    }
  }
}
