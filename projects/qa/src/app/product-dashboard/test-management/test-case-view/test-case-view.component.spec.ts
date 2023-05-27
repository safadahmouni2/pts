
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { TestCaseViewComponent } from './test-case-view.component';
import { TestCaseServices } from '../../../services/testCaseServices';

describe('TestCaseViewComponent', () => {
  let component: TestCaseViewComponent;
  let fixture: ComponentFixture<TestCaseViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestCaseViewComponent],
      providers: [TestCaseServices],
      imports: [HttpClientTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestCaseViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('functionality test of getAllTestCase method', () => {
    const service = TestBed.inject(TestCaseServices);
    const result = service.getTestCaseListBySprintId(12457886);
    expect(result).toBeDefined();
  });
});
