import { Component, effect, inject, input, OnInit, signal, WritableSignal } from '@angular/core';
import { CandidatesApi } from '../../services/candidates-api';
import { MessageService, PrimeTemplate } from 'primeng/api';
import { Candidate } from '../../models/candidate.model';
import { Avatar } from 'primeng/avatar';
import { Tag } from 'primeng/tag';
import { Button } from 'primeng/button';
import { Timeline } from 'primeng/timeline';
import { TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { HeaderActionsService } from '../../../../layouts/main-layout/header/header-actions.service';
import { BreadcrumbService } from '../../../../layouts/main-layout/header/breadcrumb.service';
import { Card } from 'primeng/card';
import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';

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
  ],
  templateUrl: './candidate-profile.html',
  styleUrl: './candidate-profile.css',
})
export class CandidateProfile implements OnInit {
  private readonly candidatesApi = inject(CandidatesApi);
  private readonly messageService = inject(MessageService);
  private readonly headerActions = inject(HeaderActionsService);
  private readonly breadcrumb = inject(BreadcrumbService);

  id = input.required<string>();
  candidateData = signal<Candidate | null>(null);
  timelineEvents: WritableSignal<{ status?: string; date: string; icon: string; color: string }[]> =
    signal([]);
  protected readonly activeTab = signal<string | number | undefined>('resume');

  constructor() {
    effect(() => {
      this.loadCandidateProfile(this.id());
    });
  }

  ngOnInit() {
    this.setHeaderActions();
  }

  private formatDate(dateString?: string): string {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  private loadTimelineEvents() {
    this.timelineEvents.set([
      {
        status: 'Created',
        date: this.formatDate(this.candidateData()?.CreateDate),
        icon: 'pi pi-calendar-plus',
        color: '#60A5FA',
      },
      {
        status: 'Opened',
        date: this.formatDate(this.candidateData()?.OpenedDate),
        icon: 'pi pi-folder-open',
        color: '#F97316',
      },
      {
        status: this.candidateData()?.Status,
        date: 'Current',
        icon: 'pi pi-check-circle',
        color: '#4ADE80',
      },
    ]);
  }
  private loadCandidateProfile(id: string) {
    if (id) {
      this.candidatesApi.getCandidateById(this.id()).subscribe({
        next: (res) => {
          this.candidateData.set(res);
          this.setBreadcrumbItems();
          this.loadTimelineEvents();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.message || 'Failed to load candidate profile',
          });
        },
      });
    }
  }

  private setBreadcrumbItems() {
    this.breadcrumb.breadcrumbItems = [
      {
        label: 'Candidates',
        routerLink: '/candidates',
      },
      {
        label: this.candidateData()?.FullName,
        routerLink: `/candidates/${this.id()}`,
      },
    ];
  }

  private setHeaderActions() {
    this.headerActions.actions = [
      {
        label: 'Add Note',
        command: () => console.log('Add Note'),
        icon: 'pi pi-plus',
        severity: 'secondary',
        outlined: true,
      },
      {
        label: 'Change State',
        command: () => console.log('Change State'),
        icon: 'pi pi-pencil',
        severity: 'secondary',
        outlined: true,
      },
      {
        label: 'View Resume',
        command: () => console.log('View Resume'),
        icon: 'pi pi-file',
        severity: 'secondary',
        outlined: true,
      },
      {
        label: 'Save',
        command: () => console.log('Save'),
        icon: 'pi pi-check',
        severity: 'primary',
      },
    ];
  }
}
