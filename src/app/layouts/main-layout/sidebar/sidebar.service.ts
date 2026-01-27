import { Injectable } from '@angular/core';

export interface DroppedItem {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class SidebarService {}
