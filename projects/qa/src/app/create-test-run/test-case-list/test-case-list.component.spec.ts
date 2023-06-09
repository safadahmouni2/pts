
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCaseListComponent } from './test-case-list.component';

describe('TestCaseListComponent', () => {
  let component: TestCaseListComponent;
  let fixture: ComponentFixture<TestCaseListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestCaseListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestCaseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
