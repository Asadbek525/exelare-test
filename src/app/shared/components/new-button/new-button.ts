import { Component, HostListener, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { NewActionDialogComponent } from './new-action-dialog/new-action-dialog.component';

@Component({
  selector: 'app-new-button',
  standalone: true,
  imports: [ButtonModule, NewActionDialogComponent],
  templateUrl: './new-button.html',
})
export class NewButtonComponent {
  visible = signal(false);

  openDialog() {
    this.visible.set(true);
  }

  // Keyboard navigation
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Cmd+I (Mac) or Ctrl+I (Windows/Linux) to OPEN
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'i') {
      event.preventDefault();
      this.openDialog();
      return;
    }
  }

  get isMac(): boolean {
    return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  }

  get shortcutText(): string {
    return this.isMac ? '⌘+I' : 'Ctrl+I';
  }
}
