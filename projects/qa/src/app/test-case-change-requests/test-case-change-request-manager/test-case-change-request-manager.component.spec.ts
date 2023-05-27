import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCaseChangeRequestManagerComponent } from './test-case-change-request-manager.component';

describe('TestCaseChangeRequestManagerComponent', () => {
  let component: TestCaseChangeRequestManagerComponent;
  let fixture: ComponentFixture<TestCaseChangeRequestManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestCaseChangeRequestManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestCaseChangeRequestManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
