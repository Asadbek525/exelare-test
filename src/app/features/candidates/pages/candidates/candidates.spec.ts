import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { Candidates } from './candidates';
import { CandidatesApi } from '../../services/candidates-api';
import { MessageService } from 'primeng/api';

describe('Candidates', () => {
  let component: Candidates;
  let fixture: ComponentFixture<Candidates>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Candidates],
      providers: [
        {
          provide: CandidatesApi,
          useValue: { getCandidates: () => of({ records: [] }) },
        },
        {
          provide: MessageService,
          useValue: {
            add: () => {
              return undefined;
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Candidates);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
