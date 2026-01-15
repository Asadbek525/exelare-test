import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobPipeline } from './job-pipeline';

describe('JobPipeline', () => {
  let component: JobPipeline;
  let fixture: ComponentFixture<JobPipeline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobPipeline],
    }).compileComponents();

    fixture = TestBed.createComponent(JobPipeline);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
