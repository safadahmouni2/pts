/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestcaseUserStoryComponent } from './testcase-user-story.component';

describe('TestcaseUserStoryComponent', () => {
  let component: TestcaseUserStoryComponent;
  let fixture: ComponentFixture<TestcaseUserStoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestcaseUserStoryComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestcaseUserStoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
