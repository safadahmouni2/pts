import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingTeamListComponent } from './meeting-team-list.component';

describe('MeetingTeamListComponent', () => {
  let component: MeetingTeamListComponent;
  let fixture: ComponentFixture<MeetingTeamListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingTeamListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeetingTeamListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
