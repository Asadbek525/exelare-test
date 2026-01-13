import { Component, effect, inject, input, signal } from '@angular/core';
import { CandidatesApi } from '../../services/candidates-api';
import { MessageService } from 'primeng/api';
import { Candidate } from '../../models/candidate.model';
import { Card } from 'primeng/card';
import { Avatar } from 'primeng/avatar';
import { Tag } from 'primeng/tag';
import { Button } from 'primeng/button';
import { ProgressBar } from 'primeng/progressbar';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-candidate-profile',
  imports: [Card, Avatar, Tag, Button, ProgressBar, ProgressSpinner],
  templateUrl: './candidate-profile.html',
  styleUrl: './candidate-profile.css',
})
export class CandidateProfile {
  private readonly candidatesApi = inject(CandidatesApi);
  private readonly messageService = inject(MessageService);
  id = input.required<string>();
  candidate = signal<Candidate | null>(null);

  constructor() {
    effect(() => {
      this.loadCandidateProfile(this.id());
    });
  }

  private loadCandidateProfile(id: string) {
    if (id) {
      this.candidatesApi.getCandidateById(this.id()).subscribe({
        next: (res) => {
          this.candidate.set(res);
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
}
