import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SprintPlanningComponent } from './sprint-planning.component';

describe('SprintPlanningComponent', () => {
  let component: SprintPlanningComponent;
  let fixture: ComponentFixture<SprintPlanningComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SprintPlanningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SprintPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
