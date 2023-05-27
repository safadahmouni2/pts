import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Globals } from '../../config/globals';
import { UserStoryServices } from '../../services/userStoryServices';
import { environment } from '../../../environments/environment';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-user-story-item',
  templateUrl: './user-story-item.component.html',
  styleUrls: ['./user-story-item.component.css'],
})
export class UserStoryItemComponent implements OnInit, OnDestroy {
  chatUrl: string;
  isProd = environment.production;
  destroy$ = new Subject<void>();
  @Input() userStory: any;
  usAssignedTaskList: any;

  private updateUsStateInProgress = false;

  constructor(
    private userStoryService: UserStoryServices,
    private toastr: ToastrService,
    private globals: Globals
  ) { }

  ngOnInit() {
    this.chatUrl = this.globals.getChatUrl(this.userStory.id, 'us');
    if (+this.userStory.assigned_tickets_number > 0) {
      this.userStoryService.getAssignedTicketsByUserStoryId(this.userStory.id).pipe(takeUntil(this.destroy$)).subscribe(
        (data) => {
          this.usAssignedTaskList = data;
        }
      );
    }
  }

  public updateUsTestState(stateId: number, state: string): void {
    if (!this.updateUsStateInProgress) {
      this.updateUsStateInProgress = true;
      this.userStoryService
        .updateUserStoryState(stateId, state, this.userStory.id, +this.globals.getUserId())
        .pipe(finalize(() => this.updateUsStateInProgress = false))
        .subscribe(
          () => {
            this.toastr.success('User Story updated successfully');
            this.userStory.stateId = stateId;
            this.userStory.state = state;
          }
        );
    }
  }
  public getAssignedTaskType(AssignedTaskType: string): string {
    return AssignedTaskType.charAt(0);
  }
  public getAssignedTaskUpdateDate(dateTime: string): string {
    return dateTime.split(' ')[0];
  }
  public getAssignedTaskChatUrl(AssignedTaskId: number, AssignedTaskType: string): string {
    return this.globals.getChatUrl(AssignedTaskId, AssignedTaskType);
  }

  ngOnDestroy(): void {
    // Unsubscribe from all observables and complete destroy subject
    this.destroy$.next();
    this.destroy$.complete();
  }
}
