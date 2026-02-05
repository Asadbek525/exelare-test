import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  ViewChildren,
  QueryList,
  signal,
  computed,
  model,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

export interface ActionItem {
  label: string;
  icon: string;
  group: string;
  command?: () => void;
}

@Component({
  selector: 'app-new-action-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    TagModule,
    IconFieldModule,
    InputIconModule,
  ],
  templateUrl: './new-action-dialog.component.html',
  styles: [
    `
      :host ::ng-deep .new-action-dialog .p-dialog-content {
        padding: 0 !important;
        border-radius: 0.75rem !important; /* rounded-xl */
        overflow: hidden;
        background: transparent !important;
        border: none !important;
      }

      :host ::ng-deep .new-action-dialog {
        box-shadow: none !important;
        background: transparent !important;
        border: none !important;
      }

      /* Custom scrollbar for the actions list */
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }

      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }

      .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: #e2e8f0;
        border-radius: 20px;
      }

      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background-color: #cbd5e1;
      }
    `,
  ],
})
export class NewActionDialogComponent {
  visible = model<boolean>(false);

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  @ViewChildren('actionItemRef') actionItems!: QueryList<ElementRef>;

  searchQuery = signal('');
  selectedIndex = signal(0);

  // Define all available actions
  readonly allActions: ActionItem[] = [
    // Candidate Actions
    {
      label: 'Add Candidate Manually',
      icon: 'pi pi-pencil',
      group: 'Candidate',
    },
    {
      label: 'GrabIT (parse from Clipboard)',
      icon: 'pi pi-copy',
      group: 'Candidate',
    },
    { label: 'Parse Resumes', icon: 'pi pi-file', group: 'Candidate' },
    {
      label: 'Import Resume with AI',
      icon: 'pi pi-sparkles',
      group: 'Candidate',
    },
    {
      label: 'Find Candidates from Job Portals',
      icon: 'pi pi-search',
      group: 'Candidate',
    },
    { label: 'Import Candidates from CSV', icon: 'pi pi-upload', group: 'Candidate' },
    {
      label: 'Export All Candidates',
      icon: 'pi pi-download',
      group: 'Candidate',
    },

    // Company Actions
    { label: 'Add Company', icon: 'pi pi-plus', group: 'Company' },
    { label: 'Import Companies from CSV', icon: 'pi pi-upload', group: 'Company' },

    // Contact Actions
    { label: 'Add Contact', icon: 'pi pi-plus', group: 'Contact' },
    { label: 'Import Contacts from CSV', icon: 'pi pi-upload', group: 'Contact' },

    // Job Actions
    { label: 'Create Job', icon: 'pi pi-plus', group: 'Job' },
    { label: 'Import Jobs from CSV', icon: 'pi pi-upload', group: 'Job' },

    // Lead Actions
    { label: 'Create Lead', icon: 'pi pi-plus', group: 'Lead' },

    // Opportunity Actions
    { label: 'Create Opportunity', icon: 'pi pi-plus', group: 'Opportunity' },
  ];

  // Filtered actions based on search query
  filteredActions = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.allActions;

    return this.allActions.filter(
      (action) =>
        action.label.toLowerCase().includes(query) || action.group.toLowerCase().includes(query),
    );
  });

  constructor() {
    effect(() => {
      if (this.visible()) {
        this.searchQuery.set('');
        this.selectedIndex.set(0);
        setTimeout(() => this.searchInput?.nativeElement?.focus(), 100);
      }
    });
  }

  onSearchInput(query: string) {
    this.searchQuery.set(query);
    this.selectedIndex.set(0);
  }

  selectAction(action: ActionItem) {
    console.log('Selected action:', action);
    this.visible.set(false);
    // Here you would navigate or trigger the actual action
  }

  // Keyboard navigation
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.visible()) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.selectedIndex.update((i) => {
        const newIndex = Math.min(i + 1, this.filteredActions().length - 1);
        this.scrollToIndex(newIndex);
        return newIndex;
      });
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.selectedIndex.update((i) => {
        const newIndex = Math.max(i - 1, 0);
        this.scrollToIndex(newIndex);
        return newIndex;
      });
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const actions = this.filteredActions();
      if (actions.length > 0) {
        this.selectAction(actions[this.selectedIndex()]);
      }
    }
    // ESC is handled by p-dialog mask/close-on-escape automatically, or we can handle it if needed.
  }

  scrollToIndex(index: number) {
    setTimeout(() => {
      const items = this.actionItems.toArray();
      if (items[index]) {
        items[index].nativeElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth',
        });
      }
    });
  }

  getGroupBadgeSeverity(
    group: string,
  ): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    const map: Record<
      string,
      'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined
    > = {
      Candidate: 'info', // Blue
      Job: 'success', // Green
      Contact: 'secondary', // Purple/Grayish
      Company: 'warn', // Orange
      Lead: 'warn', // Yellow/Orange
      Opportunity: 'danger', // Red/Pink
    };
    return map[group] || 'secondary';
  }
}
