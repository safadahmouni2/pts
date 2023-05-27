import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCaseChangeRequestsComponent } from './test-case-change-requests.component';

describe('TestCaseChangeRequestsComponent', () => {
  let component: TestCaseChangeRequestsComponent;
  let fixture: ComponentFixture<TestCaseChangeRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestCaseChangeRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestCaseChangeRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
