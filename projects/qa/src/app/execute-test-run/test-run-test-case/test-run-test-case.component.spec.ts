
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestRunTestCaseComponent } from './test-run-test-case.component';

describe('TestRunTestCaseComponent', () => {
  let component: TestRunTestCaseComponent;
  let fixture: ComponentFixture<TestRunTestCaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestRunTestCaseComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestRunTestCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
