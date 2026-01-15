import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatePipeline } from './candidate-pipeline';

describe('CandidatePipeline', () => {
  let component: CandidatePipeline;
  let fixture: ComponentFixture<CandidatePipeline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidatePipeline],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidatePipeline);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
