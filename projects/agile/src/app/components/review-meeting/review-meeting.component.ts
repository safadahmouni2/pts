import { Component, OnInit, ViewContainerRef, ViewChild, AfterViewInit } from '@angular/core';

import { SocketioService } from '../../services/index';
import { AuthenticationService, DailyScrumService, SprintService, UserService } from '../../services/index';
import { ActivatedRoute } from '@angular/router';
import { ToastrService, ToastContainerDirective } from 'ngx-toastr';
import { SprintGrapgQlService } from '../../services/pts-api/agile/sprint.service';
import { Subject, takeUntil } from 'rxjs';
import { Sprint } from '../../models/sprint.model';
import { SprintMemberGraphQlService } from '../../services/pts-api/agile/sprint-member.service';


@Component({
  selector: 'app-review-meeting',
  templateUrl: './review-meeting.component.html',
  styleUrls: ['./review-meeting.component.css']
})
export class ReviewMeetingComponent implements OnInit, AfterViewInit {
  connection;
  sprintId: any;
  sprint: Sprint;
  currentUser ;
  userStatusUpdateLoadingChange: boolean;
  currentUserId = ((sessionStorage.currentUser) ? (+JSON.parse(sessionStorage.currentUser).id) : null);

  @ViewChild(ToastContainerDirective, { static: true })
  toastContainer: ToastContainerDirective;
  destroy$ = new Subject();
  constructor(
      private route: ActivatedRoute,
      private authenticationService: AuthenticationService,
      private socketservice: SocketioService,
      public toastr: ToastrService,
      public dailyScrumService: DailyScrumService,
      vcr: ViewContainerRef,
      private userService: UserService,
      private sprintGrapgQlService: SprintGrapgQlService,
      private sprintMemberGrapgQlService: SprintMemberGraphQlService) {
  }

  ngAfterViewInit(): void {
      this.toastr.overlayContainer = this.toastContainer;
  }

  ngOnInit(): void {

      this.route.params.subscribe(params => {
          this.sprintId = params['id'];
          this.sprintGrapgQlService.getSprintDetailsByTicketId(+this.sprintId)
           .pipe(takeUntil(this.destroy$))
           .subscribe(sprintData => {
            if (sprintData.data) {
              this.sprint = sprintData.data.getSprintDetailsByTicketId;
              // this.userService.getUserRoleBySprint(this.currentUserId, +this.sprint.ticketId).subscribe((user) => {
              //     console.log('current user home : ', user[0]);
              //     this.currentUser = user[0];
              // });
              const input = {
                  sprintId: this.sprint.id,
                  stateId:1030058 // sprintMember status ON
              };   
              this.sprintMemberGrapgQlService.filterSprintMembers(input).subscribe(users => {
                  const sprintMembers = users.data.filterSprintMembers.items;
                   // load current user photo
                  this.userService.getCurrentUser().subscribe(dataSource => {
                      const sms = sprintMembers.filter((element) => { return element.userCode === dataSource[0].user_code});
                      this.currentUser  = {
                          ...sms[0],
                          role: sms.map(element => element.role).join(', ')
                      }
                  });
              },
                  err => {
                      console.log('Something went wrong!', err);
                  }
              );
              
            }
          }, (error) => {
                  console.log('faild to get sprintDetail from sprint parent', error);
          });
          
      });
  }

  ngOnDestroy(): void {
      this.destroy$.next(undefined);
      this.destroy$.complete();
  }

  logout() {
      const curuser = JSON.stringify(JSON.parse(sessionStorage.currentUser).username);
      this.socketservice.deleteUser(curuser);
      this.authenticationService.logout();
      // this.router.navigate(['/login']);
  }
}
