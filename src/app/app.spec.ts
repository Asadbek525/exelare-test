import { TestBed } from '@angular/core/testing';
import { RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';

import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App, RouterOutlet],
      providers: [
        {
          provide: MessageService,
          useValue: {
            add: () => {
              return undefined;
            },
            messageObserver: new Subject(),
            clearObserver: new Subject(),
          },
        },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have router outlet', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });
});
