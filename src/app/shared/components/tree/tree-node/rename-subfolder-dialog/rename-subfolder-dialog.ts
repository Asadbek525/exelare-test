import { Component, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { PrimeTemplate } from 'primeng/api';
import { Select } from 'primeng/select';

export interface RenameSubfolderData {
  label: string;
  icon: string;
}

@Component({
  selector: 'app-rename-subfolder-dialog',
  standalone: true,
  imports: [Dialog, Button, InputText, FormsModule, PrimeTemplate, Select],
  templateUrl: './rename-subfolder-dialog.html',
})
export class RenameSubfolderDialog {
  visible = model<boolean>(false);
  currentLabel = input<string>('');
  currentIcon = input<string>('pi pi-fw pi-list');
  renamed = output<RenameSubfolderData>();

  newLabel = '';
  selectedIcon = '';

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

  onVisibleChange(visible: boolean) {
    if (visible) {
      this.newLabel = this.currentLabel();
      this.selectedIcon = this.currentIcon();
    }
  }

  save() {
    if (this.newLabel.trim()) {
      this.renamed.emit({ label: this.newLabel.trim(), icon: this.selectedIcon });
      this.visible.set(false);
    }
  }

  cancel() {
    this.visible.set(false);
  }
}
