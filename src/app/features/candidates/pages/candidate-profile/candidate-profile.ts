import { Component, computed, inject, input, signal, WritableSignal } from '@angular/core';
import { CandidatesService } from '../../services';
import { PrimeTemplate } from 'primeng/api';
import { Avatar } from 'primeng/avatar';
import { Tag } from 'primeng/tag';
import { Button } from 'primeng/button';
import { Timeline } from 'primeng/timeline';
import { TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { BreadcrumbService } from '../../../../layouts/main-layout/header/breadcrumb.service';
import { Card } from 'primeng/card';
import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { DEFAULT_TABS, TabConfig, TABS_STORAGE_KEY } from './tab-config.model';
import { CustomizeTabsDialog } from './customize-tabs-dialog/customize-tabs-dialog';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap, tap } from 'rxjs';
import { Candidate } from '../../models/candidate.model';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-candidate-profile',
  imports: [
    Avatar,
    Tag,
    Button,
    Timeline,
    PrimeTemplate,
    Tabs,
    TabPanels,
    TabPanel,
    Card,
    Accordion,
    AccordionPanel,
    AccordionHeader,
    AccordionContent,
    CustomizeTabsDialog,
    NgOptimizedImage,
  ],
  templateUrl: './candidate-profile.html',
  styleUrl: './candidate-profile.css',
  standalone: true,
})
export class CandidateProfile {
  private readonly candidatesService = inject(CandidatesService);
  private readonly breadcrumb = inject(BreadcrumbService);

  id = input.required<string>();
  private readonly candidateData$ = toObservable(this.id).pipe(
    switchMap((id) =>
      this.candidatesService.getCandidateById(id).pipe(
        tap((candidate) => {
          if (candidate) {
            this.setBreadcrumbItems(candidate);
            this.loadTimelineEvents(candidate);
          }
        }),
      ),
    ),
  );
  candidateData = toSignal(this.candidateData$);
  timelineEvents: WritableSignal<{ status?: string; date: string; icon: string; color: string }[]> =
    signal([]);
  protected readonly activeTab = signal<string | number | undefined>('resume');

  // Tab customization
  tabs = signal<TabConfig[]>(this.loadTabConfiguration());
  showCustomizeDialog = signal(false);
  visibleTabs = computed(() =>
    this.tabs()
      .filter((t) => t.visible)
      .sort((a, b) => a.order - b.order),
  );

  openCustomizeDialog() {
    this.showCustomizeDialog.set(true);
  }

  onTabsSaved(updatedTabs: TabConfig[]) {
    this.tabs.set(updatedTabs);

    // Auto-switch to first visible tab if current tab is hidden
    const currentActiveTab = this.activeTab();
    const visibleTabIds = updatedTabs.filter((t) => t.visible).map((t) => t.id);
    if (!visibleTabIds.includes(currentActiveTab as string)) {
      const firstVisible = updatedTabs
        .filter((t) => t.visible)
        .sort((a, b) => a.order - b.order)[0];
      if (firstVisible) {
        this.activeTab.set(firstVisible.id);
      }
    }
  }

  private loadTabConfiguration(): TabConfig[] {
    const stored = localStorage.getItem(TABS_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return structuredClone(DEFAULT_TABS);
      }
    }
    return structuredClone(DEFAULT_TABS);
  }

  private formatDate(dateString?: string): string {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  private loadTimelineEvents(candidate: Candidate) {
    this.timelineEvents.set([
      {
        status: 'Created',
        date: this.formatDate(candidate.CreateDate),
        icon: 'pi pi-calendar-plus',
        color: '#60A5FA',
      },
      {
        status: 'Opened',
        date: this.formatDate(candidate.OpenedDate),
        icon: 'pi pi-folder-open',
        color: '#F97316',
      },
      {
        status: candidate.Status,
        date: 'Current',
        icon: 'pi pi-check-circle',
        color: '#4ADE80',
      },
    ]);
  }

  private setBreadcrumbItems(candidate: Candidate) {
    this.breadcrumb.breadcrumbItems = [
      {
        label: 'Candidates',
        routerLink: '/Consultants',
      },
      {
        label: candidate.FullName,
        routerLink: `/Consultants/profile/${candidate.ConsIntID}`,
      },
    ];
  }
}
