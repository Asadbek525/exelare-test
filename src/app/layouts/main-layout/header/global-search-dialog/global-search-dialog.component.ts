import {
  Component,
  ElementRef,
  HostListener,
  inject,
  OnDestroy,
  signal,
  ViewChild,
  model,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { Subject } from 'rxjs';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import {
  GlobalSearchService,
  SearchResult,
} from '../../../../shared/services/global-search.service';

@Component({
  selector: 'app-global-search-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    TagModule,
    ButtonModule,
  ],
  templateUrl: './global-search-dialog.component.html',
  styles: [
    `
      /* Custom scrollbar for the results list */
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
export class GlobalSearchDialogComponent implements OnDestroy {
  private readonly searchService = inject(GlobalSearchService);
  private readonly router = inject(Router);

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  /** Dialog visibility (two-way binding) */
  visible = model<boolean>(false);

  /** Search query */
  readonly searchQuery = signal('');

  /** Selected result index for keyboard navigation */
  readonly selectedIndex = signal(0);

  /** Search results */
  readonly searchResults = signal<SearchResult[]>([]);

  /** Loading state */
  readonly isLoading = signal(false);

  /** Search input subject for debouncing */
  private readonly searchSubject = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  constructor() {
    // Reset state when dialog opens
    effect(() => {
      if (this.visible()) {
        this.searchQuery.set('');
        this.searchResults.set([]);
        this.selectedIndex.set(0);
        setTimeout(() => this.searchInput?.nativeElement?.focus(), 100);
      }
    });

    // Set up debounced search
    this.searchSubject
      .pipe(
        debounceTime(300),
        switchMap((query) => {
          if (query.length < 2) {
            return [];
          }
          this.isLoading.set(true);
          return this.searchService.search(query);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe((results) => {
        this.searchResults.set(results);
        this.isLoading.set(false);
      });
  }

  /** Handle search input */
  onSearchInput(query: string): void {
    this.searchQuery.set(query);
    this.selectedIndex.set(0);
    this.searchSubject.next(query);
  }

  /** Select a search result */
  selectResult(result: SearchResult): void {
    if (result.route) {
      this.router.navigate([result.route]);
    }
    this.visible.set(false);
  }

  /** Keyboard shortcut listener (Cmd/Ctrl + K and navigation) */
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    // Cmd+K (Mac) or Ctrl+K (Windows/Linux) logic handled by parent or here?
    // It's better if parent handles global open shortcut if distinct.
    // But navigation logic should be here when visible.

    if (!this.visible()) return;

    // Arrow navigation in results
    if (this.searchResults().length > 0) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.selectedIndex.update((i) => Math.min(i + 1, this.searchResults().length - 1));
        this.scrollToIndex(this.selectedIndex());
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.selectedIndex.update((i) => Math.max(i - 1, 0));
        this.scrollToIndex(this.selectedIndex());
      } else if (event.key === 'Enter') {
        event.preventDefault();
        this.selectResult(this.searchResults()[this.selectedIndex()]);
      }
    }
  }

  scrollToIndex(index: number) {
    // Basic scrolling logic - can be refined if using virtual scroll or item refs
    // For now, relies on simple scrollIntoView if we had item refs,
    // but without item refs we might need a different approach or just let it be.
    // Re-adding the item ref approach from NewActionDialog if possible.
    const item = document.getElementById(`search-result-item-${index}`);
    item?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  /** Get type badge severity */
  getTypeBadgeSeverity(
    type: string,
  ): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    // Mapping from previous CSS classes:
    // candidate: blue (info)
    // job: green (success)
    // contact: purple (secondary)
    // company: orange (warn)
    const map: Record<
      string,
      'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined
    > = {
      candidate: 'info',
      job: 'success',
      contact: 'secondary',
      company: 'warn',
    };
    return map[type] || 'secondary';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
