
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestRunUserStoryComponent } from './test-run-user-story.component';

describe('TestRunUserStoryComponent', () => {
  let component: TestRunUserStoryComponent;
  let fixture: ComponentFixture<TestRunUserStoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestRunUserStoryComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestRunUserStoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
