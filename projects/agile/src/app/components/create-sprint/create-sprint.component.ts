import { Component, OnInit, Input, EventEmitter, Output, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { UserService, SprintService } from '../../services/index';
import { Sprint } from '../../models/sprint.model';
import { ProjectService } from '../../services/project.service';
import { Product } from '../../models/product.model';
import { State } from '../../models/state.model';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';
import { SprintGrapgQlService } from '../../services/pts-api/agile/sprint.service';
import { SprintMemberGraphQlService } from '../../services/pts-api/agile/sprint-member.service';
import { StateService } from '../../services/state.service';
import { CommentService } from '../../services/comment.service';

@Component({
  selector: 'app-create-sprint',
  templateUrl: './create-sprint.component.html',
  styleUrls: ['./create-sprint.component.css']
})
export class CreateSprintComponent implements OnInit, AfterViewChecked {

  stateName: string;
  dsDuration = '';
  project = '';
  status = '';
  showDsDurationDropdown = false;
  showProjectDropdown = false;
  showStatusDropdown = false;
  showDsSTartTimePicker = false;
  startValue: Date;
  endValue: Date;
  datePickerStartStatus = '';
  datePickerEndStatus = '';
  bsInlineValue = new Date();
  @Input() productId: number;
  @Input() spId: Sprint;
  @Input() sprintParentId: number;
  sprintTicketId:number;
  sprint: Sprint = new Sprint();
  @Output() displaySprintDetail = new EventEmitter<boolean>();
  displaySprintDetailView: boolean;
  @Input() productName: string;
  emptyRequiredField = false;
  sprintCreationView: boolean;
  projectsList: string[] = [];
  allowedStateList: State[] = [];
  showFieldButton: string = null;
  dsDurationList = ['10', '15', '30'];
  startDateString: string;
  endDateString: string;
  invalidStartDateValue: boolean = false;
  invalidEndDateValue: boolean = false;
  invalidStartTimeValue: boolean = false;
  stateRole: string = 'Active';
  isSMOrSMDByProduct: boolean;
  isSMOrSMDBySprint: boolean;
  isDsStartPickerOkClicked: boolean;

  sprintLoading = false;
  @Output() sprintRecentlyAdded: EventEmitter<Sprint> = new EventEmitter(null);
  @ViewChild('textareaAddComment', { static: true }) commentField: ElementRef;
  @ViewChild('addCommentButtons', { static: true }) commentButtons: ElementRef;

  constructor(private userService: UserService,
    private sprintGrapgQlService: SprintGrapgQlService,
    private sprintMemberGrapgQlService: SprintMemberGraphQlService,
    private projectService: ProjectService,
    private stateService: StateService,
    private commentService: CommentService
  ) { }

  ngOnInit() {
    this.isScrumMasterOrScrumMasterDeputyByProduct(this.productId);
    if (this.spId == null) {
      if (this.sprintParentId) {
        // have to get default value from parent id
        // set before save in sprint object
        this.getSprintDetailsFromParentSprint(this.sprintParentId);
      }
      this.sprintCreationView = true;
      sessionStorage.removeItem('sprint');
      sessionStorage.removeItem('sprintStartDate');
      sessionStorage.removeItem('sprintEndDate');
    } else {
      this.isScrumMasterOrScrumMasterDeputyBySprint(this.spId.id);
      this.sprintCreationView = false;
      this.getSprintDetailsBySprintID(this.spId.id);
      sessionStorage.removeItem('sprint');
      sessionStorage.removeItem('sprintStartDate');
      sessionStorage.removeItem('sprintEndDate');
    }

    this.getProjectsByProduct(this.productId);
  }

  ngAfterViewChecked() {
    this.onCommentValueChange();
  }

  fieldFocus(event, field: string) {
    event.target.parentNode.classList.add('focused');
    this.showFieldButton = field;
  }

  fieldBlur(event) {
    if (event.target.value === '') {
      event.target.parentNode.classList.remove('focused');
    }
  }

  datePickerFocus(field: string) {
    this.showFieldButton = field;
  }

  changeDsValue(event) {
    this.sprint.dsDuration = event.target.dataset.value;
  }

  changeStatusValue(event) {
    this.sprint.state = event.target.dataset.value;
    for (const data of this.allowedStateList) {
      if (data.stateName === this.sprint.state) {
        this.sprint.stateId = data.stateId;
        this.getStateName(data.stateId);
        this.getAllowedStateList(data.stateId);
      }
    }
  }

  changeProjectValue(event) {
    this.sprint.project = event.target.dataset.value;
  }

  toggleDsDurationDropdown(field: string) {
    this.showDsDurationDropdown = !this.showDsDurationDropdown;
    this.showFieldButton = field;
  }

  toggleProjectDropdown(field: string) {
    this.showProjectDropdown = !this.showProjectDropdown;
    this.showFieldButton = field;
  }

  toggleStatusDropdown(field: string) {
    this.showStatusDropdown = !this.showStatusDropdown;
    if (this.showStatusDropdown === true) {
      this.getAllowedStateList(this.sprint.stateId);
    }
    this.showFieldButton = field;
  }

  showDsStartPicker(field: string) {
    this.isDsStartPickerOkClicked = false;
    this.showDsSTartTimePicker = true;
    this.showFieldButton = field;
  }

  hideDsStartPicker() {
    this.showDsSTartTimePicker = false;
  }

  onSubmitDsStartTime() {
    this.isDsStartPickerOkClicked = true;
    if (this.sprint.appDsStartTime) {
      this.showDsSTartTimePicker = false;
    }
  }

  onCommentValueChange() {
    if (this.commentButtons) {
      if (this.commentField.nativeElement.scrollHeight > this.commentField.nativeElement.clientHeight) {
        this.commentButtons.nativeElement.classList.add('has-scrollbar');
      } else {
        this.commentButtons.nativeElement.classList.remove('has-scrollbar');
      }
    }
  }

  addComment(comment: string): void {
    if (this.sprint.ticketId) {
      this.sprintLoading = true;
      this.commentService.addComment(comment, this.sprint.ticketId)
        .pipe(finalize(() => this.sprintLoading = false))
        .subscribe(() => {
          this.sprint.addComment = null;
        });
      this.showFieldButton = null;
    }
  }

  onSaveSprint(): void {

    if (this.sprint.name == null) {
      this.emptyRequiredField = true;
    } else {
      this.emptyRequiredField = false;
      this.sprintLoading = true;
      this.userService.getCurrentUser().subscribe(dataSource => {

        const sprintInputData = {
          name: this.sprint.name,
          shortName: this.sprint.shortName,
          startDate: moment(this.sprint.startDate).format('YYYY-MM-DD'),
          endDate: moment(this.sprint.endDate).format('YYYY-MM-DD'),
          dsStartTime: moment(this.sprint.appDsStartTime).format('HH:mm:ss'),
          productId: this.productId,
          dsMeetingUrl: this.sprint.dsMeetingUrl,
          dsDuration: this.sprint.dsDuration,
          parent: this.sprintParentId,
          stateId: 1017796
        };

        this.sprintGrapgQlService.createSprint(sprintInputData).subscribe(data => {
          this.getStateName(1017796);
          let stateId;
          const SearchSprintMemberInput = {
            sprintId: this.sprintParentId,
            stateId
          };
          if (this.sprintParentId) {
            this.sprintMemberGrapgQlService.filterSprintMembers(SearchSprintMemberInput).subscribe(result => {
              console.log("result ", result);

              const sprintMembers = result.data.filterSprintMembers.items;
              const lastSprintMemberId = sprintMembers[sprintMembers.length - 1].id;
              sprintMembers.forEach(sprintMember => {
                let sprintMemberId = sprintMember.id;
                sprintMember.sprintId = data.data.createSprint.id;
                delete sprintMember.id;
                this.sprintMemberGrapgQlService.createSprintMember(sprintMember)
                .pipe(finalize(() => this.sprintCreationView = false))
                .subscribe(() => {
                  // executed only when creating the last sprintMember
                  if (lastSprintMemberId === sprintMemberId) {
                    this.sprint.id = data.data.createSprint.id;
                    this.sprint.stateId = data.data.createSprint.stateId;
                    this.sprintCreationView = false;
                    this.spId = this.sprint;
                    this.sprintRecentlyAdded.emit(this.sprint);
                    sessionStorage.setItem('sprint', JSON.stringify(this.sprint));
                    this.startDateString = moment(this.sprint.startDate).format('YYYY-MM-DD');
                    this.endDateString = moment(this.sprint.endDate).format('YYYY-MM-DD');
                    sessionStorage.setItem('sprintStartDate', JSON.stringify(this.startDateString));
                    sessionStorage.setItem('sprintEndDate', JSON.stringify(this.endDateString));
                  }
                });
              });
            });
          } else {
            this.userService.getproductTeam(this.productName).subscribe(users => {
              users.forEach((user) => {
                // get user roles from product
                this.userService.getUserRolesInProductTeam(this.productId, user.user_id).subscribe(userRoles => {
                  for (const role of userRoles) {
                    const sprintMember = {
                      userCode: user.user_code,
                      sprintId: data.data.createSprint.id,
                      stateId: 1030058,
                      role: role.role_name
                    }
                    this.sprintMemberGrapgQlService.createSprintMember(sprintMember) 
                     .pipe(finalize(() => this.sprintCreationView = false))
                     .subscribe(() => {
                      if (users[users.length - 1] === user && userRoles[userRoles.length - 1] === role) {
                        this.sprint.id = data.data.createSprint.id;
                        this.sprint.stateId = data.data.createSprint.stateId;
                        this.sprintCreationView = false;
                        this.spId = this.sprint;
                        this.sprintRecentlyAdded.emit(this.sprint);
                        sessionStorage.setItem('sprint', JSON.stringify(this.sprint));
                        this.startDateString = moment(this.sprint.startDate).format('YYYY-MM-DD');
                        this.endDateString = moment(this.sprint.endDate).format('YYYY-MM-DD');
                        sessionStorage.setItem('sprintStartDate', JSON.stringify(this.startDateString));
                        sessionStorage.setItem('sprintEndDate', JSON.stringify(this.endDateString));
                      }
                    });
                  }
                });
              });
            });
          }
          // should be removed after sprint member
          this.sprintLoading = false;
        }, (err) => {
          console.log('Save Creation Error', err);
          this.sprintLoading = false;
        }
        ); // end creation service

      });
    }
    this.showFieldButton = null;
  }

  onDisplaySprintDetail() {
    this.displaySprintDetailView = false;
    this.displaySprintDetail.emit(this.displaySprintDetailView);
    sessionStorage.removeItem('sprint');
    sessionStorage.removeItem('sprintStartDate');
    sessionStorage.removeItem('sprintEndDate');
  }

  onUpdateFields(paramName: string, paramValue: any) {
    console.log("cheking")
    if (paramName === 'startDate' || paramName === 'endDate') {
      paramValue = moment(paramValue).format('YYYY-MM-DD');
    } else if (paramName === 'dsStartTime') {
      paramValue = moment(paramValue).format('HH:mm:ss');

    }

    this.updateSprintFields(paramName, paramValue);
    this.showFieldButton = null;
  }
  onGetFields() {
    this.showFieldButton = null;

    // this.getSprintDetailsBySprintID(this.sprint.sprintId);
    this.sprint = JSON.parse(sessionStorage.getItem('sprint'));
    this.sprint.startDate = JSON.parse(sessionStorage.getItem('sprintStartDate'));
    this.sprint.endDate = JSON.parse(sessionStorage.getItem('sprintEndDate'));
    this.getStateName(this.sprint.stateId);
  }

  private updateSprintFields(paramName: string, paramValue: any): void {

    this.sprintLoading = true;
    const sprintInputData = {}
    sprintInputData[paramName] = paramValue;

    this.sprintGrapgQlService.updateSprint(this.spId.id, sprintInputData)
      .pipe(finalize(() => this.sprintLoading = false))
      .subscribe(() => {
        sessionStorage.setItem('sprint', JSON.stringify(this.sprint));

        this.startDateString = moment(this.sprint.startDate).format('YYYY-MM-DD');
        this.endDateString = moment(this.sprint.endDate).format('YYYY-MM-DD');
        sessionStorage.setItem('sprintStartDate', JSON.stringify(this.startDateString));
        sessionStorage.setItem('sprintEndDate', JSON.stringify(this.endDateString));
        this.onInvalidFieldValue(paramName, false);

      }, (error) => {
        this.onInvalidFieldValue(paramName, true);
        console.log('Upadate field is failed', error);
      });

  }

  onInvalidFieldValue(paramName: string, invalid: boolean) {
    if (paramName === 'lockDate') {
      this.invalidStartDateValue = invalid;
    } else if (paramName === 'mailDate') {
      this.invalidEndDateValue = invalid;
    } else if (paramName === 'targetDate') {
      this.invalidStartTimeValue = invalid;
    }
  }

  onUpdateState() {
    this.updateStateOfSprint(this.sprint.stateId);
    this.showFieldButton = null;
  }

  updateStateOfSprint(stateId: number) {
    this.sprintLoading = true;
    const sprintInputData = { stateId };
    this.sprintGrapgQlService.updateSprint(this.spId.id, sprintInputData)
      .pipe(finalize(() => this.sprintLoading = false))
      .subscribe(() => {
        sessionStorage.setItem('sprint', JSON.stringify(this.sprint));
      });
  }

  // get list of project in this prodcut
  getProjectsByProduct(productId: number): void {
    this.projectService.getAllProjectByProduct(productId).subscribe(dataSource => {
      for (const data of dataSource) {
        const product = new Product();
        // product.productId = data.project_id;
        product.productName = data.project_name;
        this.projectsList.push(product.productName);
      }
    });
  }

  getSprintDetailsBySprintID(id: number): void {
    this.sprintLoading = true;
    this.sprintGrapgQlService.getSprintDetailsById(id)
      .pipe(finalize(() => this.sprintLoading = false))
      .subscribe(sprintData => {
        if (sprintData.data) {
          this.sprint = sprintData.data.getSprintDetailsById;

          this.sprint.appDsStartTime = this.sprint.dsStartTime ? moment(this.sprint.dsStartTime, 'HH:mm').toDate() : null;

          this.sprintParentId = this.sprint.parent;
          this.sprintTicketId=this.sprint.ticketId;
          this.getStateName(this.sprint.stateId)
          sessionStorage.setItem('sprint', JSON.stringify(this.sprint));
        }
        else {
          console.log("sprint data is null or undefined");
        }
      });
  }


  getSprintDetailsFromParentSprint(parentId: number): void {

    this.sprintLoading = true;
    this.sprintGrapgQlService.getSprintDetailsById(this.sprintParentId)
      .pipe(finalize(() => this.sprintLoading = false))
      .subscribe(sprintData => {
        const tmpSprint = sprintData.data.getSprintDetailsById;
        tmpSprint.parent = this.sprintParentId;
        tmpSprint.id = null;
        tmpSprint.appDsStartTime = tmpSprint.dsStartTime ? moment(tmpSprint.dsStartTime, 'HH:mm').toDate() : null;
        this.sprint = tmpSprint;
        this.sprintLoading = false;
      }, (error) => {
        console.log('faild to get sprintDetail from sprint parent', error);
      });
  }

  getAllowedStateList(stateId: number): void {
    this.stateService.getNextAllowedStatesForSprint(stateId).subscribe(dataSource => {
      this.allowedStateList = [];
      for (const data of dataSource) {
        const state = new State();
        state.stateId = data.status_id;
        state.stateName = data.status_name;
        this.allowedStateList.push(state);
      }
    });
  }

  onActionLoading(event) {
    this.sprintLoading = event;
  }

  isScrumMasterOrScrumMasterDeputyByProduct(productId: number) {

    this.userService.getCurrentUser().subscribe(dataSource => {
      this.userService.getListScrumMasterAndScrumMasterDeputyByProduct(productId).subscribe(data => {

        if (data.length > 0) {
          data.forEach(element => {
            if (element.user_id === dataSource[0].user_id) {
              this.isSMOrSMDByProduct = true;
            }
          });
        } else {
          console.log('no SM/SMD available');
          this.isSMOrSMDByProduct = false;
        }

      });
    });


  }

  isScrumMasterOrScrumMasterDeputyBySprint(id: number) {

    this.userService.getCurrentUser().subscribe(dataSource => {
      this.userService.getListScrumMasterAndScrumMasterDeputyBySprint(id).subscribe(data => {

        if (data.length > 0) {
          data.forEach(element => {
            if (element.responsible_id === dataSource[0].user_id) {
              this.isSMOrSMDBySprint = true;
            }
          });
        } else {
          console.log('no SM/SMD available');
          this.isSMOrSMDBySprint = false;
        }

      });
    });
  }

  getStateName(stateId) {
    this.stateService.getStateById(stateId).subscribe(state => {
      if (state) {
        this.stateName = state[0].statusName;
      }
    });
  }
}

