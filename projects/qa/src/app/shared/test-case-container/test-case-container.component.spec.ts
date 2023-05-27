
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCaseContainerComponent } from './test-case-container.component';

describe('TestCaseContainerComponent', () => {
  let component: TestCaseContainerComponent;
  let fixture: ComponentFixture<TestCaseContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestCaseContainerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestCaseContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
