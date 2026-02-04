import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Avatar } from 'primeng/avatar';
import { Checkbox } from 'primeng/checkbox';
import { Tag } from 'primeng/tag';
import { STAGE_SEVERITY_MAP, STATUS_SEVERITY_MAP } from '../../../../shared/utils';
import { Candidate } from '../../../../models/candidate.model';
import { Tooltip } from 'primeng/tooltip';
import { RouterLink } from '@angular/router';
import { CandidatesService } from '../../../../services';
import { FormsModule } from '@angular/forms';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[app-candidate-row]',
  imports: [Avatar, Checkbox, Tag, Tooltip, RouterLink, FormsModule],
  templateUrl: './candidate-row.html',
  styleUrl: './candidate-row.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CandidateRow {
  private readonly candidatesService = inject(CandidatesService);

  readonly candidate = input.required<Candidate>();

  protected readonly isSelected = computed(() =>
    this.candidatesService.isSelected(this.candidate()),
  );

  protected candidateLocation = computed(() => {
    const parts = [this.candidate().City, this.candidate().State].filter(Boolean);
    return parts.join(', ');
  });

  /** Format phone as (XXX) XXX-XXXX when possible */
  protected formattedPhone = computed(() => this.formatPhone(this.candidate().MobilePhone));

  private formatPhone(phone: string | undefined): string {
    if (!phone) return '';
    const digits = phone.replace(/\D/g, '');
    if (digits.length >= 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
    if (digits.length >= 7) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 7)}`;
    }
    return phone;
  }

  protected avatarColor = computed(() => {
    const name = this.candidate().FullName || '';
    if (!name) return this.avatarColors[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return this.avatarColors[Math.abs(hash) % this.avatarColors.length];
  });

  // Avatar colors based on name hash
  protected readonly avatarColors = [
    '#ef4444', // red
    '#f97316', // orange
    '#eab308', // yellow
    '#22c55e', // green
    '#14b8a6', // teal
    '#06b6d4', // cyan
    '#3b82f6', // blue
    '#8b5cf6', // violet
    '#ec4899', // pink
  ];

  protected readonly STAGE_SEVERITY_MAP = STAGE_SEVERITY_MAP;
  protected readonly STATUS_SEVERITY_MAP = STATUS_SEVERITY_MAP;

  protected onSelectionToggle(): void {
    this.candidatesService.toggleCandidateSelection(this.candidate());
  }
}
