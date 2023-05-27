import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCaseLibraryEditComponent } from './test-case-library-edit.component';

describe('TestCaseLibraryEditComponent', () => {
  let component: TestCaseLibraryEditComponent;
  let fixture: ComponentFixture<TestCaseLibraryEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestCaseLibraryEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestCaseLibraryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
