import { Component, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { PrimeTemplate } from 'primeng/api';
import { Select } from 'primeng/select';

export interface SublistData {
  label: string;
  icon: string;
}

@Component({
  selector: 'app-create-sublist-dialog',
  standalone: true,
  imports: [Dialog, Button, InputText, FormsModule, PrimeTemplate, Select],
  templateUrl: './create-sublist-dialog.html',
})
export class CreateSublistDialog {
  visible = model<boolean>(false);
  label = '';
  selectedIcon = 'pi pi-fw pi-list';
  created = output<SublistData>();

  availableIcons = [
    { label: 'List', value: 'pi pi-fw pi-list', icon: 'pi pi-list' },
    { label: 'Folder', value: 'pi pi-fw pi-folder', icon: 'pi pi-folder' },
    { label: 'Star', value: 'pi pi-fw pi-star', icon: 'pi pi-star' },
    { label: 'Heart', value: 'pi pi-fw pi-heart', icon: 'pi pi-heart' },
    { label: 'Bookmark', value: 'pi pi-fw pi-bookmark', icon: 'pi pi-bookmark' },
    { label: 'Tag', value: 'pi pi-fw pi-tag', icon: 'pi pi-tag' },
    { label: 'Flag', value: 'pi pi-fw pi-flag', icon: 'pi pi-flag' },
    { label: 'Users', value: 'pi pi-fw pi-users', icon: 'pi pi-users' },
    { label: 'Briefcase', value: 'pi pi-fw pi-briefcase', icon: 'pi pi-briefcase' },
    { label: 'Building', value: 'pi pi-fw pi-building', icon: 'pi pi-building' },
  ];

  save() {
    if (this.label.trim()) {
      this.created.emit({ label: this.label.trim(), icon: this.selectedIcon });
      this.reset();
      this.visible.set(false);
    }
  }

  cancel() {
    this.reset();
    this.visible.set(false);
  }

  private reset() {
    this.label = '';
    this.selectedIcon = 'pi pi-fw pi-list';
  }
}
