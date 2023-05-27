import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HorizentalBarsComponent } from './horizental-bars.component';

describe('HorizentalBarsComponent', () => {
  let component: HorizentalBarsComponent;
  let fixture: ComponentFixture<HorizentalBarsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HorizentalBarsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HorizentalBarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
