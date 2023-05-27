import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCaseImportComponent } from './test-case-import.component';

describe('TestCaseImportComponent', () => {
  let component: TestCaseImportComponent;
  let fixture: ComponentFixture<TestCaseImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestCaseImportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestCaseImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
