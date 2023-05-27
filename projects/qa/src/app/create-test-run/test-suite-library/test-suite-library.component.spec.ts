
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestSuiteLibraryComponent } from './test-suite-library.component';

describe('TestSuiteLibraryComponent', () => {
  let component: TestSuiteLibraryComponent;
  let fixture: ComponentFixture<TestSuiteLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestSuiteLibraryComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestSuiteLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
