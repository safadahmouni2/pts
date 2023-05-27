import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { CUSTOM_ELEMENTS_SCHEMA , NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentsComponent } from './components/components.component';
import { BarsComponent } from './components/bars/bars.component';
import { HorizentalBarsComponent } from './components/horizental-bars/horizental-bars.component';
import { PerformancePieComponent } from './components/performance-pie/performance-pie.component';
import { RadarComponent } from './components/radar/radar.component';
import { RatingComponent } from './components/rating/rating.component';
import { CreateSOComponent } from './components/create-so/create-so.component';
import { EventsComponent } from './components/events/events.component';
import { PropositionsComponent } from './components/propositions/propositions.component';
describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        ComponentsComponent,
        BarsComponent,
        HorizentalBarsComponent,
        PerformancePieComponent,
        RadarComponent,
        RatingComponent,
        CreateSOComponent,
        EventsComponent,
        PropositionsComponent
      ],
      imports: [
        RouterTestingModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA],
       providers: [],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'TT-HR-SMART'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('TT-HR-SMART');
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to TT-HR-SMART!');
  });
});
