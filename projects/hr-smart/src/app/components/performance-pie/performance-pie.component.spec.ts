import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PerformancePieComponent } from './performance-pie.component';

describe('PerformancePieComponent', () => {
  let component: PerformancePieComponent;
  let fixture: ComponentFixture<PerformancePieComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PerformancePieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformancePieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
