import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCaseHistoryListComponent } from './test-case-history-list.component';

describe('TestCaseHistoryListComponent', () => {
  let component: TestCaseHistoryListComponent;
  let fixture: ComponentFixture<TestCaseHistoryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestCaseHistoryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestCaseHistoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
