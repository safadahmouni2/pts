/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStorySectionComponent } from './user-story-section.component';

describe('UserStorySectionComponent', () => {
  let component: UserStorySectionComponent;
  let fixture: ComponentFixture<UserStorySectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserStorySectionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserStorySectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


});
