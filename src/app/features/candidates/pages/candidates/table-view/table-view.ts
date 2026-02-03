import { Component, input, signal } from '@angular/core';
import { CandidateRow } from './candidate-row/candidate-row';
import { CdkDrag, CdkDragPlaceholder, CdkDragPreview, CdkDropList } from '@angular/cdk/drag-drop';
import { Checkbox } from 'primeng/checkbox';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { Candidate } from '../../../models/candidate.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-table-view',
  imports: [
    CandidateRow,
    CdkDrag,
    CdkDragPreview,
    CdkDropList,
    Checkbox,
    InputText,
    Select,
    TableModule,
    FormsModule,
    CdkDragPlaceholder,
  ],
  templateUrl: './table-view.html',
  styleUrl: './table-view.css',
})
export class TableView {
  readonly candidates = input.required<Candidate[]>();

  protected dragData(candidate: Candidate) {
    return {
      id: candidate.ConsIntID,
      label: candidate.FullName,
      type: 'candidate',
      ...candidate,
    };
  }
  // Pagination state
  protected readonly first = signal(0);
  protected readonly rows = signal(10);
  protected readonly rowsPerPageOptions = [10, 25, 50, 100];
  protected selectedCandidates = signal<Candidate[]>([]);
}
