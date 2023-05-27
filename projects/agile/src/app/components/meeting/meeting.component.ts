import { Component, OnInit, OnDestroy, AfterViewInit, Input, ViewChild } from '@angular/core';
import { DragulaService, DragulaOptions } from 'ng2-dragula';
import { SocketioService, DailyScrumService, UserService } from '../../services/index';
import { ToastrService, ToastContainerDirective } from 'ngx-toastr';
import { Sprint, User } from '../../models/index.model';
import { UserStoryService } from '../../services/index';
import { UserStory } from '../../models/user-story.model';
import { SprintGrapgQlService } from '../../services/pts-api/agile/sprint.service';
import { Subject, takeUntil, finalize, map, forkJoin } from 'rxjs';
import { DailyScrumGrapgQlService } from '../../services/pts-api/agile/daily-scrum.service';
import { SprintMemberGraphQlService } from '../../services/pts-api/agile/sprint-member.service';
import { UserStoryGrapgQlService } from '../../services/pts-api/agile/user-story.service';
import { StateOption } from '../../models/status-optionmulti.model';
import { StateService } from '../../services/state.service';
import { PrioService } from '../../services/prio.service';
import { Urgency } from '../../models/urgency.model';
import { Speaker } from '../../models/speaker.model';
import { ProductService } from '../../services/product.service';
interface CustomDragulaOptions<T = any> extends DragulaOptions<T> {
  moves?: (el: Element, container: Element, handle: Element) => boolean;
}

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.css']
})
export class MeetingComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() sprintId: string;
  usUpdateLoading: boolean;
  sprintDetails: {};
  @Input() currentUser: any;
  currentUserId: number = +JSON.parse(sessionStorage.currentUser).id;
  currentUserCode: string = JSON.parse(sessionStorage.currentUser).usercode;
  userStories: UserStory[] = [];
  DsId;
  activate: boolean = false;
  dsDashboardColumns: [{}];
  speaker:Speaker = { id: -1, code: '' , userId : null };
  private dropSubscription: any;
  private dragSubscription: any;
  selectedUs: UserStory;
  sprint: Sprint;
  userStoryStatesList: Array<StateOption> = [];
  listUrgency: Urgency[] = [];
  
  @ViewChild(ToastContainerDirective, { static: true })
  toastContainer: ToastContainerDirective;
  productTeamMembers = [];
  destroy$ = new Subject();
  constructor(
    public dailyScrumService: DailyScrumService,
    private dragulaService: DragulaService,
    private socketservice: SocketioService,
    public toastr: ToastrService,
    private userStoryService: UserStoryService,
    private sprintGrapgQlService: SprintGrapgQlService,
    private userStoryGrapgQlService:UserStoryGrapgQlService,
    public dailyScrumGrapgQlService: DailyScrumGrapgQlService,
    private sprintMemberGrapgQlService:SprintMemberGraphQlService,
    private stateService:StateService,
    private prioService:PrioService,
    public productService: ProductService,
    private userService: UserService) {

    const bag: any = this.dragulaService.find('nested-bag');
    if (bag !== undefined) {
      this.dragulaService.destroy('nested-bag');
    }

    const options: CustomDragulaOptions = {
      copySortSource: false,
      moves: (el, container, handle) => {
        handle.classList.contains('handle');
        return true;
      }
    };

    dragulaService.createGroup('nested-bag', options);

    this.dragSubscription = dragulaService.drag().subscribe((value) => {
      this.onDragModel(value, this.currentUser);
    });

    this.dropSubscription = dragulaService.drop().subscribe((value) => {
      this.onDropModel(value);
    });
  }

  private onDragModel(args: any, user: User): void {

    if (!this.activate) {
      this.toastr.error(
        'Click to activate drag and drop', null, { enableHtml: true, positionClass: 'toast-bottom-right', closeButton: true }
      );
      this.dragulaService.find('nested-bag').drake.cancel(true);
    }
  }


  private onDropModel(args: any): void {

    let oldStateId, oldStateName, newStateId, newStateName, userStoryId;


    oldStateId = +args.source.dataset.id;
    oldStateName = args.source.dataset.name;
    newStateId = +args.target.dataset.id;
    newStateName = args.target.dataset.name;
    userStoryId = +args.el.dataset.id;
    this.usUpdateLoading = true;

    var speakerCode = this.userStories.find(us => us.id == userStoryId)?.userCode;
    var speakerId = this.userStories.find(us => us.id == userStoryId)?.responsibleId;

    this.userStoryService.selectedUserSpeaker$.subscribe((value) => {
      this.userStoryService.speaker$.subscribe((speaker) => {
        speakerCode = speaker.code;
        speakerId = speaker.userId;
      });
    });

    const userStoryUpdateInput = {
      stateId: newStateId,
      userCode: speakerCode,
      responsibleId: speakerId
    }
  
      this.userStoryGrapgQlService.updateUserStory(userStoryId , userStoryUpdateInput)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.usUpdateLoading = false;
        })
      )
      .subscribe(
        (data) => {
          this.userStories.forEach(element => {
            if(element.id === userStoryId ) {
                element.stateId= newStateId;
              }
          }) ; 
          
          console.log('user strory state updated ..');
          this.updateUserStoryNotification(
            { old: oldStateName, new: newStateName, user: this.speaker.code, us: userStoryId, ds: this.DsId, sprint: +this.sprintId }
          );
          this.usUpdateLoading = false;
          if (newStateId == 1017777) { // empty userStories only when move us to done to avoid doubled us
            this.userStories = [];
          }
        }, (err) => {
          this.usUpdateLoading = false;
          console.log('errororororor', err);
          this.toastr.error(
            'You can not chage state from ' + ' <strong> ' + oldStateName + '</strong> to' + newStateName,
            null,
            { enableHtml: true, positionClass: 'toast-top-center', closeButton: true }
          );
          this.dragulaService.find('nested-bag').drake.cancel(true);
          this.loadUserStories(this.sprint.id);
        },
        () => console.log('Done')
      );
  
    }

  private updateUserStoryNotification(notification: any) {
    this.socketservice.updateUserStoryNotification(notification);
  }

  ngAfterViewInit(): void {
    this.toastr.overlayContainer = this.toastContainer;
  }

  ngOnInit(): void {

    this.getUserStoryStatesList();
    this.getListUrgency();

    this.sprintGrapgQlService.getSprintDetailsByTicketId(+this.sprintId)
            .pipe(takeUntil(this.destroy$))
            .subscribe(sprintData => {
              if (sprintData.data) {
                this.sprint = sprintData.data.getSprintDetailsByTicketId;
                this.loadUserStories(this.sprint.id);

                this.dailyScrumGrapgQlService.startedDailyScrumBySprintId(+this.sprint.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe((startedDailyScrumBySprintId) => {
            
                  if (startedDailyScrumBySprintId?.data?.startedDailyScrumBySprintId) {
                    const ds = startedDailyScrumBySprintId.data.startedDailyScrumBySprintId;
                    this.DsId = ds.ticketId;
                    const SearchSprintMemberInput = {
                      sprintId: this.sprintId,
                      stateId: 1030058 // sprintMmeber status ON
                    };
                    this.sprintMemberGrapgQlService.filterSprintMembers(SearchSprintMemberInput).subscribe(users => {

                      const speakinglist = users.data.filterSprintMembers.items.filter(item => {
                        if (item.stateId === 1017911) {
                          return true;
                        }
                      });
            
                      
                      if (speakinglist.length > 0
                        && (this.currentUser.role.match('Scrum master') || this.currentUserId === speakinglist[0].userId)) {
                          this.productService.getListProductById(this.sprint?.productId).subscribe(data => {
                            if (data[0]?.product_name) {
                              this.userService.getproductTeam(data[0]?.product_name).subscribe(result => {
                                this.productTeamMembers = result;
                      
                                 this.speaker.id = speakinglist[0].id;
                                 this.speaker.userId = speakinglist[0].userId;
                                 this.speaker.code = speakinglist[0].userCode;
                                 this.activate = true;
                              });
                            }
                          });
                      } else { this.activate = true; }
                    },
                      err => {
                        console.log('Something went wrong!', err);
                      }
                    );
                  } else {
                    this.DsId = null;
                  }
            
                });
              }
            }, (error) => {
                    console.log('faild to get sprintDetail from sprint parent', error);
    });

    this.loadDsDashboardColumns();






    this.socketservice.getDsNotification('ds-start')
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe(notification => {
      // this.notifications.push(notification);

      const DsId = +JSON.parse(JSON.stringify(notification)).text.ds;
      const sprintId = +JSON.parse(JSON.stringify(notification)).text.sprint;
      if (+this.sprintId === sprintId) {
        this.activate = false;
        this.toastr.info(
          ' Daily Scrum <strong> Started </strong>  ', null, { enableHtml: true, positionClass: 'toast-bottom-right', closeButton: true }
        );
      }
    });


    this.socketservice.getDsNotification('ds-finished')
    .pipe(
      takeUntil(this.destroy$)
    ).subscribe(notification => {
      const sprintId = +JSON.parse(JSON.stringify(notification)).text.sprint;
      if (+this.sprintId === sprintId) {
        this.activate = false;
        this.DsId = null;
        this.toastr.info(
          ' Daily Scrum <strong> Finished </strong>  ', null, { enableHtml: true, positionClass: 'toast-bottom-right', closeButton: true }
        );

      }
    });


    this.socketservice.getNewUserTalking()
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe(notification => {
      const userCode: string = JSON.parse(JSON.stringify(notification)).text.userCode;
      const state: string = JSON.parse(JSON.stringify(notification)).text.state;
      const sprintId: number = +JSON.parse(JSON.stringify(notification)).text.sprintId;
      const user  = this.getSprintMemberUserData(userCode);
      if (+this.sprintId === sprintId) {

        this.toastr.info(
          userCode + ' <strong>' + state + '</strong>  ',
          null,
          { enableHtml: true, positionClass: 'toast-bottom-right', closeButton: true }
        );
        if (this.currentUser?.role.match('Scrum master') || this.currentUserId === user?.user_id) {
          if (state === 'Speaking') {
            this.activate = true;
            this.speaker.id = user?.id;
            this.speaker.code = user?.user_code;
            this.speaker.userId= user?.user_id;
            this.toastr.success(
              'Drag and drop enabled', null, { enableHtml: true, positionClass: 'toast-bottom-right', closeButton: true }
            );
          } else {
            this.activate = false;
            this.speaker.id = -1;
            this.speaker.code = '';
            this.toastr.info(
              'Drag and drop disabled', null, { enableHtml: true, positionClass: 'toast-bottom-right', closeButton: true }
            );
          }
        } else {
          if (this.activate === true) {
            this.activate = false;
            this.speaker.id = -1;
            this.speaker.code = '';
            this.toastr.info(
              'Drag and drop disabled', null, { enableHtml: true, positionClass: 'toast-bottom-right', closeButton: true }
            );
          }
        }
      }
    });

    this.socketservice.getUpdatedUserStoryNotification()
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe(notification => {
      const userCode: string = JSON.parse(JSON.stringify(notification)).text.user;
      const usId: number = +JSON.parse(JSON.stringify(notification)).text.us;
      const newStateName: string = JSON.parse(JSON.stringify(notification)).text.new;
      const oldStateName: string = JSON.parse(JSON.stringify(notification)).text.old;
      const sprintId = +JSON.parse(JSON.stringify(notification)).text.sprint;
      if (+this.sprintId === sprintId) {
        if (this.currentUser?.role.match('Scrum master') || this.currentUserCode === userCode) {
          this.toastr.success(
            ' US: ' + usId + ' <strong> Updated </strong> from  ' + oldStateName + ' to ' + newStateName,
            null,
            { enableHtml: true, positionClass: 'toast-bottom-right', closeButton: true });
        } else {
          this.toastr.info(
            ' US: ' + usId + ' <strong> Updated </strong> from  '
            + oldStateName + ' to ' + newStateName + ' by <strong>' + userCode + '</strong>',
            null,
            { enableHtml: true, positionClass: 'toast-bottom-right', closeButton: true });
        }
        this.loadUserStories(this.sprint.id);
        this.loadDsDashboardColumns();
      }
    });

  }


  // Let's unsubscribe our Observable
  ngOnDestroy() {
    this.dropSubscription.unsubscribe();
    this.dragSubscription.unsubscribe();
    this.destroy$.next(undefined);
    this.destroy$.complete();
  }

  ShowDetail(userStory: UserStory): void {
    this.selectedUs = userStory;
  }

  hideDetail(): void {
    this.selectedUs = undefined;
  }
  private loadUserStories(sprintId: number) {
    forkJoin({
      userStories: this.userStoryGrapgQlService.getUserStoriesBySprintId(sprintId),
      stories: this.userStoryService.getUserStoriesBySprint(this.sprint.ticketId)
    })
    
    .subscribe(({userStories, stories}) => {

      let tmpUserStories = [];
      this.userStories = [];
      console.log('getUserStoriesBySprint :', userStories);

      tmpUserStories = userStories.data.getUserStoriesBySprintId.items.map(element => {
        const userStory = new UserStory();
        userStory.id = element.id;
        userStory.stateId = element.stateId;
        userStory.state = this.userStoryStatesList.find(state => state.id == element.stateId)?.itemName;
        userStory.text = element.text;
        userStory.responsible = element.responsible;
        userStory.storyPoints = element.storyPoints;
        userStory.urgencyId = element.urgencyId;
        userStory.urgencyIcon = this.listUrgency.find(urgency => urgency.urgencyId == element.urgencyId)?.urgencyIcon;
        userStory.progress = element.progress;
        userStory.projectName = element.projectName;
        userStory.topicName = element.topic_name;
        userStory.springShortName = element.ps_name;
        userStory.chat_url = element.chat_url;
        userStory.assignedTasketsNumber = element.assigned_tickets_number;
        userStory.userCode = element.userCode;
        userStory.shortDescription = element.shortDescription;
        userStory.sprint = element.sprint;
        userStory.ticketId = element.ticketId;
        userStory.is_changed = stories.find(el => { return el.id === element.ticketId })?.is_changed

        return userStory;
      });

      this.userStories = tmpUserStories;


    });

  }


  private loadDsDashboardColumns() {
    this.userStoryService.getDsDashboardColumns()
      .subscribe(dsDashboardColumns => {
        this.dsDashboardColumns = dsDashboardColumns;
      },
        error => {
          console.log(
            "Something went wrong!",
            "color:red;font-size:12px",
            error
          );
        }
      );
  }

  public stateInStatusList(state: string, statusList: string): boolean {

    const nstate: string = state.toString();
    const nstatusList: any = statusList.split(',');
    if (nstatusList.indexOf(nstate) === -1) {
      return false;
    } else {
      return true;
    }
  }

  private getUserStoryStatesList(): void {
    this.stateService.getAllStatusOfUserStory()
      .pipe(map((dataSource: any) => dataSource.map(statusItem => {
        const statusOption = new StateOption();
        statusOption.id = statusItem.status_id;
        statusOption.itemName = statusItem.name;
        return statusOption;
      })))
      .subscribe(dataSource => {
        this.userStoryStatesList = dataSource;
      });
     
  }

  private getListUrgency(): void {

    this.prioService.getAllPrioOfUserStory().subscribe(dataSource => {

        const listUrgency: Urgency[] = [];
        for (const data of dataSource) {
            const urgencyCmb = new Urgency();
            urgencyCmb.urgencyId = data.urgency_id;
            urgencyCmb.urgencyIcon = data.icon;
            urgencyCmb.urgencyName = data.urgency_label;
            listUrgency.push(urgencyCmb);
        }
        this.listUrgency = listUrgency;
    });
}

  getSprintMemberUserData(userCode: string) {
    return userCode ? this.productTeamMembers.find(item => item.user_code === userCode) : null;
  }

}
