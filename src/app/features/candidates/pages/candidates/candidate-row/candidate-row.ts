import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Avatar } from 'primeng/avatar';
import { Checkbox, CheckboxChangeEvent } from 'primeng/checkbox';
import { Tag } from 'primeng/tag';
import { STAGE_SEVERITY_MAP, STATUS_SEVERITY_MAP } from '../../../shared/utils';
import { Candidate } from '../../../models/candidate.model';
import { Tooltip } from 'primeng/tooltip';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[app-candidate-row]',
  imports: [Avatar, Checkbox, Tag, Tooltip],
  templateUrl: './candidate-row.html',
  styleUrl: './candidate-row.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CandidateRow {
  readonly candidate = input.required<Candidate>();
  readonly selected = input<boolean>();
  readonly candidateToggled = output<boolean>();

  protected candidateLocation = computed(() => {
    const parts = [this.candidate().City, this.candidate().State].filter(Boolean);
    return parts.join(', ');
  });

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

  protected candidateToggle(event: CheckboxChangeEvent) {
    this.candidateToggled.emit(event.checked);
  }
}
