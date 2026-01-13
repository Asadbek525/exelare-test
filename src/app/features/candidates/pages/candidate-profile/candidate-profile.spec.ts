import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateProfile } from './candidate-profile';
import { MessageService } from 'primeng/api';
import { CandidatesApi } from '../../services/candidates-api';
import { of } from 'rxjs';

describe('CandidateProfile', () => {
  let component: CandidateProfile;
  let fixture: ComponentFixture<CandidateProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateProfile],
      providers: [
        {
          provide: CandidatesApi,
          useValue: { getCandidateById: () => of(null) },
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

    fixture = TestBed.createComponent(CandidateProfile);
    component = fixture.componentInstance; // Assign component here
    fixture.componentRef.setInput('id', '123');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
