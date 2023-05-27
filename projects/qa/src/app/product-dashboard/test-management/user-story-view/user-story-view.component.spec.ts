
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStoryViewComponent } from './user-story-view.component';
import { UserStoryServices } from '../../../services/userStoryServices';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UserStoryViewComponent', () => {
  let component: UserStoryViewComponent;
  let fixture: ComponentFixture<UserStoryViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserStoryViewComponent],
      providers: [UserStoryServices],
      imports: [HttpClientTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserStoryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('functionality of service getUserStoryListBySprintId method', () => {
    const service = TestBed.inject(UserStoryServices);
    service.getUserStoryBySprintId(12457886).subscribe(
      data => { expect(data).toBeDefined(); });
  });

});
