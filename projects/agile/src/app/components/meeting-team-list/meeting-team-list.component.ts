import { Component, OnInit, ViewContainerRef, Input, AfterViewInit, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';

import { SocketioService, UserStoryService } from '../../services/index';

import { UserService, SprintService, DailyScrumService } from '../../services/index';
import { ToastrService, ToastContainerDirective } from 'ngx-toastr';


import { DragulaService } from 'ng2-dragula';
import { DsParticipantGraphQlService } from '../../services/pts-api/agile/ds-participant.service';
import { SprintMemberGraphQlService } from '../../services/pts-api/agile/sprint-member.service';
import { Subject, finalize, takeUntil } from 'rxjs';
import { DailyScrumGrapgQlService } from '../../services/pts-api/agile/daily-scrum.service';
import { DailyScrum } from '../../models/daily-scrum.model';
import { ProductService } from '../../services/product.service';
import { SprintGrapgQlService } from '../../services/pts-api/agile/sprint.service';
import { Speaker } from '../../models/speaker.model';

@Component({
  selector: 'app-meeting-team-list',
  templateUrl: './meeting-team-list.component.html',
  styleUrls: ['./meeting-team-list.component.css']
})
export class MeetingTeamListComponent implements OnInit, AfterViewInit, OnDestroy {
  // users: User[] = [];
  users: any[] = [];
  currentUserId: number = +JSON.parse(sessionStorage.currentUser).id;
  @Input() sprintId: any;
  @Input() currentUser: any;
  @Input() userStatusUpdateLoading: boolean;
  @Output() userStatusUpdateLoadingChange = new EventEmitter<boolean>();
  productName: string;
  sprintDetails: any;
  serverpath: string = 'https://pts.thinktank.de';
  DsId;
  ticketIdFromSprintId: number;
  isUserSpeaking: boolean = false;
  speaker: Speaker = { id: -1, code: '' , userId : null };
  sprintMembers: any[] = [];
  productTeamMembers = [];
  userCodeTest: string;
  dailyScrum: DailyScrum;
  @ViewChild(ToastContainerDirective, { static: true })
  toastContainer: ToastContainerDirective;

  destroy$ = new Subject();
  dsStarted: boolean = false;
  constructor(private dragulaService: DragulaService,
    private userService: UserService,
    private sprintService: SprintService,
    private socketservice: SocketioService,
    public toastr: ToastrService, vcr: ViewContainerRef,
    public dailyScrumService: DailyScrumService,
    private userStoryService: UserStoryService,
    private dsParticipantGrapgQlService: DsParticipantGraphQlService,
    private sprintMemberGrapgQlService: SprintMemberGraphQlService,
    public dailyScrumGrapgQlService: DailyScrumGrapgQlService,
    private sprintGrapgQlService: SprintGrapgQlService,
    public productService: ProductService) {
  }

  ngAfterViewInit(): void {
    this.toastr.overlayContainer = this.toastContainer;
  }

  ngOnInit(): void {

    this.onSelectedSpeaker(this.isUserSpeaking, this.speaker);

    this.sprintGrapgQlService.getSprintDetailsByTicketId(+this.sprintId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(sprintData => {
        if (sprintData.data) {

          this.sprintDetails = sprintData.data.getSprintDetailsByTicketId;
          this.getStartedDailyScrumBySprintId();

        }
      }, (error) => {
        console.log('faild to get sprintDetail from sprint parent', error);
      });



    this.socketservice.getNewUserTalking()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(notification => {
        const DsId: number = +JSON.parse(JSON.stringify(notification)).text.dsId;
        const sprintId: number = +JSON.parse(JSON.stringify(notification)).text.sprintId;
        if (+this.sprintId === sprintId) {
          this.getStartedDailyScrumBySprintId();
        }
      });

    this.socketservice.getNewUserNotification()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(notification => {
        // this.notifications.push(notification);
        const userId = +JSON.parse(JSON.stringify(notification)).text.user;
        const userCode = JSON.parse(JSON.stringify(notification)).text.userCode;
        const dsId = +JSON.parse(JSON.stringify(notification)).text.ds;
        const sprintId = +JSON.parse(JSON.stringify(notification)).text.sprint;
        if (+this.sprintId === sprintId) {

          this.toastr.info(userCode + ' <strong> joined </strong>',
            null,
            { enableHtml: true, positionClass: 'toast-bottom-right', closeButton: true });
          this.getStartedDailyScrumBySprintId();
          // this.getListParticipantsAndSprintTeam(this.sprintId, dsId);
        }
      });

    this.socketservice.getDsNotification('ds-finished')
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(notification => {
        if (+this.sprintId === +JSON.parse(JSON.stringify(notification)).text.sprint) {
          this.DsId = 0;
          this.dailyScrum = null;
          this.users.forEach(user => {
            const participant = this.dailyScrum?.dsParticipants.find((elem) => { return elem.userCode == user.userCode })
            user.appParticipantId = participant?.id || null;
            user.appParticipantStateId = participant?.stateId || 1017910;
          });
          //this.getListParticipantsAndSprintTeam(this.sprintId, this.DsId);
        }
      });

    this.socketservice.getDsNotification('ds-start')
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(notification => {

        if (+this.sprintId === +JSON.parse(JSON.stringify(notification)).text.sprint) {
          this.DsId = +JSON.parse(JSON.stringify(notification)).text.ds;
          this.getStartedDailyScrumBySprintId();
        }
      });
    this.getProductTeamMembers();
  }

  ngOnDestroy(): void {
    this.destroy$.next(undefined);
    this.destroy$.complete();
  }

  getProductTeamMembers(): void {
    this.sprintGrapgQlService.getSprintDetailsByTicketId(+this.sprintId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(sprintData => {
        this.ticketIdFromSprintId = sprintData.data.getSprintDetailsByTicketId.ticketId;

        this.productService.getProductBySprintsId(this.ticketIdFromSprintId).subscribe(data => {
          this.userService.getproductTeam(data[0].name).subscribe(result => {
            this.productTeamMembers = result;
          })
        })
      });
  }
  getSprintMemberPhoto(userCode: string): string {
    const member = this.productTeamMembers.find(item => item.user_code === userCode);
    return member?.photo;
  }
  getSprintMemberUserId(userCode: string): number {
    const member = this.productTeamMembers.find(item => item.user_code === userCode);
    return member?.user_id;
  }
  onSelectedSpeaker(isUserSpeaking, speaker: Speaker) {
    this.userStoryService.setIsUserSpeaking(isUserSpeaking, speaker);
  }
  private getListParticipantsAndSprintTeam(sprintId: number, DsId: number) {
    const searchSprintMemberInput = {
      sprintId: this.sprintDetails.id,
      stateId: 1030058 // sprintMmeber status ON

    };
    this.sprintMemberGrapgQlService.filterSprintMembers(searchSprintMemberInput).subscribe(users => {
      this.users = users.data.filterSprintMembers.items;
      this.users = this.users.filter((obj, pos, arr) => {
        return this.users.map(mapObj => mapObj.userCode).indexOf(obj.userCode) === pos;
      });

      this.handelParticipantState();

    },
      err => {
        console.log('Something went wrong!', err);
      }
    );
  }

  public onclick(dsPartId: number) {

    this.userStatusUpdateLoading = true;
    this.userStatusUpdateLoadingChange.emit(this.userStatusUpdateLoading);
    if (dsPartId !== this.speaker.id) {
      const dsParticipantInputData = {
        stateId: 1017911 //speaking 
      };
      this.dsParticipantGrapgQlService.updateDsParticipant(dsPartId, dsParticipantInputData).subscribe(
        (data) => {

          console.log('Ds USER state changed : ', data.data.updateDsParticipant, data.data.updateDsParticipant.stateId);


          if (this.speaker.id && this.speaker.id !== -1) {
            const dsParticipantInputData = {
              stateId: 1017909 //Joined 
            };
            this.dsParticipantGrapgQlService.updateDsParticipant(this.speaker.id, dsParticipantInputData).subscribe(
              (user) => {
                this.speaker.code = data.data.updateDsParticipant.userCode;
                this.speaker.id = data.data.updateDsParticipant.id;
                this.speaker.userId = data.data.updateDsParticipant.userId;
                console.log("sprint id from update ds particpant ", this.sprintDetails.ticketId)
                console.log('Ds USER state changed : ', user.data.updateDsParticipant.dailyScrum.id, user.data.updateDsParticipant.stateId);
                this.newUserTalking(+user.data.updateDsParticipant.userId, this.speaker.code, 'Speaking', this.DsId, +user.data.updateDsParticipant.dailyScrum.sprint.ticketId);
              },
              (err) => {
                console.log('errororororor', err);
              },
              () => console.log('Done')
            );
          } else {
            this.newUserTalking(+data.data.updateDsParticipant.userId, data.data.updateDsParticipant.userCode, 'Speaking', this.DsId, +this.sprintDetails.ticketId);
          }
          this.userStatusUpdateLoading = false;
          this.userStatusUpdateLoadingChange.emit(this.userStatusUpdateLoading);
        },
        (err) => {
          this.userStatusUpdateLoading = false;
          this.userStatusUpdateLoadingChange.emit(this.userStatusUpdateLoading);
          console.log('errororororor', err);
        },
        () => console.log('Done')
      );
    } else {
      const dsParticipantInputData = {
        stateId: 1017909 //Joined 
      };
      this.dsParticipantGrapgQlService.updateDsParticipant(dsPartId, dsParticipantInputData).subscribe(
        (user) => {
          this.userStatusUpdateLoading = false;
          this.userStatusUpdateLoadingChange.emit(this.userStatusUpdateLoading);
          console.log('Ds USER state changed : ', user.data.updateDsParticipant.dailyScrum.id, user.data.updateDsParticipant.stateId);
          this.newUserTalking(+user.data.updateDsParticipant.userId, user.data.updateDsParticipant.userCode, 'Joined', this.DsId, +this.sprintDetails.ticketId);
          this.isUserSpeaking = false;
          this.speaker.code = user.data.updateDsParticipant.userCode;
          this.speaker.id = user.data.updateDsParticipant.id;
          this.speaker.userId = user.data.updateDsParticipant.userId;
          this.onSelectedSpeaker(this.isUserSpeaking, this.speaker);
        },
        (err) => {
          this.userStatusUpdateLoading = false;
          this.userStatusUpdateLoadingChange.emit(this.userStatusUpdateLoading);
          console.log('errororororor', err);
        },
        () => console.log('Done')
      );

    }



  }


  private newUserTalking(idUser: number, userCode: string, state: string, dsId: number, sprintId: number) {
    this.socketservice.sendNewUserTalking(idUser, userCode, state, dsId, sprintId);
  }

  joinUserToDailyScrum(user) {

    const userId = this.getSprintMemberUserId(user.userCode);
    //Create new ds participant only when the current user not part of ds.dsParticipants 
    const dsParticipant = this.dailyScrum?.dsParticipants.find(e => e.userId === userId)
    if (!dsParticipant) {
      this.userStatusUpdateLoading = true;
      this.userStatusUpdateLoadingChange.emit(this.userStatusUpdateLoading)
      const dsParticipantInputData = {
        dailyScrumId: this.DsId,
        userCode: user.userCode,
        userId: +userId,
        stateId: 1017909
      };
      this.dsParticipantGrapgQlService.createDsParticipant(dsParticipantInputData)
        .pipe(takeUntil(this.destroy$),
          finalize(() => this.userStatusUpdateLoading = false))
        .subscribe(
          (data) => {
            this.socketservice.newUserNotification(+data.data.createDsParticipant.userId, data.data.createDsParticipant.userCode, +this.DsId, +this.sprintId);
            this.userStatusUpdateLoadingChange.emit(this.userStatusUpdateLoading);
          },  // changed
          (err) => {

            this.userStatusUpdateLoadingChange.emit(this.userStatusUpdateLoading);
            console.log('errororororor', err);
          },
          () => console.log('Done')
        );
    }

  }

  private getStartedDailyScrumBySprintId() {
    this.dailyScrumGrapgQlService.startedDailyScrumBySprintId(+this.sprintDetails.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((startedDailyScrumBySprintId) => {
        if (startedDailyScrumBySprintId?.data?.startedDailyScrumBySprintId) {

          this.dsStarted = true;
          this.dailyScrum = startedDailyScrumBySprintId.data.startedDailyScrumBySprintId;
          this.DsId = this.dailyScrum.id;
          this.sprintDetails = this.dailyScrum.sprint;

          if (!this.users || this.users.length == 0) {

            this.getListParticipantsAndSprintTeam(this.sprintId, this.DsId);
          } else {
            this.handelParticipantState();
          }

        } else {
          this.DsId = null;
          this.getListParticipantsAndSprintTeam(this.sprintId, 0);

        }

      });
  }

  private handelParticipantState() {
    if (this.dsStarted) {
      this.users.forEach(user => {
        const participant = this.dailyScrum?.dsParticipants.find((elem) => { return elem.userCode == user.userCode })
        user.appParticipantId = participant?.id;
        user.appParticipantStateId = participant?.stateId;
        user.userId = participant?.userId;
      });

      const speakinglist = this.users.filter(item => {
        if (item.appParticipantStateId === 1017911) {
          this.isUserSpeaking = true;
          this.speaker.code = item.userCode;
          this.speaker.id = item.appParticipantId;
          this.speaker.userId = item.userId;
          this.onSelectedSpeaker(this.isUserSpeaking, this.speaker);
          return true;
        }
      });

      if (speakinglist.length > 0) {
        this.speaker.id = speakinglist[0].appParticipantId;
        this.speaker.userId =  speakinglist[0].userId;
      } else {
        this.speaker.id = -1;
      }
    }
  }


}
