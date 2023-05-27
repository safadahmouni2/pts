/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestRunItemComponent } from './test-run-item.component';

describe('TestRunItemComponent', () => {
  let component: TestRunItemComponent;
  let fixture: ComponentFixture<TestRunItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestRunItemComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestRunItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


});
