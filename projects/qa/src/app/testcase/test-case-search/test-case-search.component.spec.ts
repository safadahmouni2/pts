import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCaseSearchComponent } from './test-case-search.component';

describe('TestCaseSearchComponent', () => {
  let component: TestCaseSearchComponent;
  let fixture: ComponentFixture<TestCaseSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestCaseSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestCaseSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
