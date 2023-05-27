import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BehaviorPieComponent } from './behavior-pie.component';

describe('BehaviorPieComponent', () => {
  let component: BehaviorPieComponent;
  let fixture: ComponentFixture<BehaviorPieComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BehaviorPieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BehaviorPieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
