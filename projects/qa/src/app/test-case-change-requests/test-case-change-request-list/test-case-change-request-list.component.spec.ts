import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCaseChangeRequestListComponent } from './test-case-change-request-list.component';

describe('TestCaseChangeRequestListComponent', () => {
  let component: TestCaseChangeRequestListComponent;
  let fixture: ComponentFixture<TestCaseChangeRequestListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestCaseChangeRequestListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestCaseChangeRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
