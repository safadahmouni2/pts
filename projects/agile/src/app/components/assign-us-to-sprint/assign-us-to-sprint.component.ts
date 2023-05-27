import { Component, OnInit, AfterViewInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserStoryService } from '../../services/userstory.service';
import { ToastrService, ToastContainerDirective } from 'ngx-toastr';
import { UserStory } from '../../models/user-story.model';
import { UserService } from '../../services/index';
import { Sprint } from '../../models/sprint.model';
import { DragulaService, DragulaOptions } from 'ng2-dragula';
import { User } from '../../models/index.model';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ProjectService } from '../../services/project.service';
import { StateService } from '../../services/state.service';
import { CommentService } from '../../services/comment.service';
import { Comment } from '../../models/comment.model';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { finalize, map, takeUntil } from 'rxjs/operators';
import { StateOption } from '../../models/status-optionmulti.model';
import { SprintGrapgQlService } from '../../services/pts-api/agile/sprint.service';
import { UserStoryGrapgQlService } from '../../services/pts-api/agile/user-story.service';
import { PrioService } from '../../services/prio.service';
import { Urgency } from '../../models/urgency.model';
import { HelperService } from '../../shared/services/helper/helper.service';
import { SprintMemberGraphQlService } from '../../services/pts-api/agile/sprint-member.service';


interface CustomDragulaOptions<T = any> extends DragulaOptions<T> {
  moves?: (el: Element, container: Element, handle: Element) => boolean;
}
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'assign-us-to-sprint',
  templateUrl: './assign-us-to-sprint.component.html'
})

export class AssignUsToSprintComponent implements OnInit, AfterViewInit, OnDestroy {
  userStoryStatesList: Array<StateOption> = [];
  usId: any;
  productId: number;
  @Input() currentUser: any;
  currentUserId: number = +JSON.parse(sessionStorage.currentUser).id;
  currentUserCode: string = JSON.parse(sessionStorage.currentUser).usercode;
  sprints: Sprint[] = [];
  notAssignedUserStories: UserStory[] = [];
  activate: boolean = true;
  myProduct: Product;
  private products: Product[] = [];
  private dropSubscription: any;
  private dragSubscription: any;
  loadingSprints: boolean;
  loadingBacklog: boolean;
  showSprint: boolean = false;
  spId: Sprint;
  showPopoverComments = false;
  addCommentMode = false;
  productName: string;
  sprintRecentlyAdded: Sprint = null;
  sprintsOptions: Array<any> = [];
  dropdownProjectsList: String[] = [];
  allSprintStatusOptions: Array<StateOption> = [];
  sprintIdSelected: number = null;
  projectNameSelected: string = null;
  stateNameSelected: string = null;
  stateSprintsList: string = '';
  sprintDetailPopover = new Sprint();
  sprintComments: Comment[] = [];
  commentText: string = '';
  sprintParentId: number;
  showChildSprintCreation: boolean = false;
  isOpen: boolean;
  userSM: string = '';
  usersSMDeputyList = [];
  isSMOrSMDByProduct: boolean;
  isSMOrSMDBySprint: boolean;
  allStatusDropdownSettings = {};
  allSprintsDropdownSettings = {};
  selectedStateItems = [];
  selectedSprintItems = [];
  listUrgency: Urgency[] = [];

  @ViewChild(ToastContainerDirective, { static: true }) inerRef;
  toastContainer: ToastContainerDirective;
  destroy$ = new Subject();
  constructor(private userStoryService: UserStoryService,
    private sprintGrapgQlService: SprintGrapgQlService,
    private productService: ProductService,
    private dragulaService: DragulaService,
    public toastr: ToastrService,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private stateService: StateService,
    private commentService: CommentService,
    private userService: UserService,
    private userStoryGrapgQlService: UserStoryGrapgQlService,
    private prioService: PrioService,
    private helper: HelperService,
    private sprintMember : SprintMemberGraphQlService
  ) {

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

    this.dropSubscription = this.dragulaService.dropModel().subscribe((value) => {
      this.onDropModel(value);
    });
  }

  ngAfterViewInit() {
    this.toastr.overlayContainer = this.toastContainer;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productId = params['id'];
    });
    this.getListState();
    this.getListUrgency();
    this.getUserStoryStatesList();
    this.isScrumMasterOrScrumMasterDeputyByProduct(this.productId);
    this.getSprintsByProduct();
    this.getListProduct();

    this.getUSByProductIdWithoutSprint();
    this.productService.getListProductById(this.productId)
      .subscribe(products => {
        this.productName = products[0].product_name;
        console.log(this.productName);
      });
    this.getProjectsByProduct(this.productId);
    this.allStatusDropdownSettings = {
      singleSelection: false,
      text: 'All Status',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: false,
      classes: 'fontawesome',
      badgeShowLimit: 0,
      labelKey: 'itemName',
      primaryKey: 'id'
    };
    this.allSprintsDropdownSettings = {
      singleSelection: false,
      text: 'All sprints',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: false,
      classes: 'fontawesome',
      badgeShowLimit: 0,
      labelKey: 'name',
      primaryKey: 'id'
    };
  }


  ngOnDestroy() {
    this.dropSubscription.unsubscribe();
    this.dragSubscription.unsubscribe();
  }
  ShowDetail(userStory: UserStory): void {
    this.usId = userStory.id;
  }

  hideDetail(): void {
    this.usId = null;
  }

  private getListProduct(): void {

    this.productService.getListProductById(this.productId)
      .subscribe(dataSource => {
        for (const data of dataSource) {
          const product = new Product();
          product.productId = data.product_id;
          product.productName = data.product_name;
          // eslint-disable-next-line eqeqeq
          if (data.product_id == this.productId) {
            this.myProduct = new Product();
            this.myProduct.productId = data.product_id;
            this.myProduct.productName = data.product_name;
            this.products.unshift(product);
          } else {
            this.products.push(product);
          }
        }
      });
  }
  private onDragModel(args: any, user: User): void {
    if (!this.activate) {
      this.toastr.error('Click to activate drag and drop'
        , null,
        { enableHtml: true, positionClass: 'toast-bottom-right', closeButton: true });
      this.dragulaService.find('nested-bag').drake.cancel(true);
    }
  }

  private onDropModel(args: any): void {
    const userStoryId = args.el.dataset.id;
    const sprintId = args.target.dataset.id;
    this.loadingBacklog = true;
    this.loadingSprints = true;
    // eslint-disable-next-line eqeqeq
    const userStoryInputData = {
      sprintId: sprintId || null
    };
    if (args.source != args.target) {
      this.userStoryGrapgQlService.updateUserStory(userStoryId, userStoryInputData)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => {
            this.loadingBacklog = false;
            this.loadingSprints = false;
          })
        )
        .subscribe((data) => {
        });
    } else {
      this.loadingBacklog = false;
      this.loadingSprints = false;
    }
  }
  private getSprintsByProduct(): void {
    this.loadingSprints = true;
    this.sprintGrapgQlService.getSprintsByProductId(this.productId).pipe(
      takeUntil(this.destroy$)
    ).subscribe((result) => {
      this.loadingSprints = false;

      const sprints = result.data.getSprintsByProductId.items;
      // init sprints list
      this.sprintsOptions = (sprints || []).map(item => ({
        id: item.id,
        name: item.name || item.id,
        sprintStartDate: item.startDate
      }));
      sprints.forEach((data, index) => {
        const sprint = new Sprint();

        sprint.id = data.id;
        sprint.name = data.name;
        sprint.stateId = data.stateId;
        sprint.state = this.allSprintStatusOptions.find(state => state.id === data.stateId)?.itemName;
        sprint.ticketId = data.ticketId;
        sprint.sprintStartDate = data.startDate;
        sprint.sprintEndDate = data.endDate;
        sprint.chatLinkUrl = this.helper.getChatUrl(data.ticketId);
        sprint.dsMeetingUrl = data.DsMeetingURL;
        this.sprints.push(sprint);
        if (sprint.id) {
          this.userStoryGrapgQlService.getUserStoriesBySprintId(sprint.id)
            .subscribe((data) => {
              for (const response of data.data.getUserStoriesBySprintId.items) {
                const userStory = new UserStory();
                userStory.id = response.id;
                userStory.state = this.userStoryStatesList.find(state => state.id == response.stateId)?.itemName;

                userStory.userCode = response.userCode;
                userStory.shortDescription = response.shortDescription;
                userStory.urgencyId = response.urgencyId;
                userStory.urgencyIcon = this.listUrgency.find(urgency => urgency.urgencyId == response.urgencyId)?.urgencyIcon;
                userStory.progress = response.progress;
                userStory.storyPoints = +response.storyPoints;
                userStory.project = response.project;

                userStory.sprint = response.sprint;
                userStory.topic = response.topic;
                if (response.topic && response.topic.name != null) {
                  userStory.topic.name = response.topic.name;
                }
                if (response.sprint && response.sprint.name != null) {
                  userStory.sprint.shortName = response.sprint.shortName;
                }

                userStory.ticketId = response.ticketId;
                userStory.chat_url = response.chat_url;
                userStory.assignedTasketsNumber = response.assigned_tickets_number;

                sprint.userStories.push(userStory);
              }

              if (index === sprints.length - 1) {
                this.loadingSprints = false;
              }

            },
              (err) => {
                console.log('Something went wrong!', err);
                if (index === sprints.length - 1) {
                  this.loadingSprints = false;
                }
              });
        }

      });
    },
      (err) => {
        this.loadingSprints = false;
        console.log('Something went wrong!', err);
      }
    );
  }

  private getUSByProductIdWithoutSprint(): void {
    this.loadingBacklog = true;
    this.userStoryGrapgQlService.getUserStoriesByProductIdWithoutSprint(this.productId).subscribe(
      notAssignedUserStories => {

        this.loadingBacklog = false;
        const notAssignedUserStoriesGraphqlResponse = notAssignedUserStories.data.getUserStoriesByProductIdWithoutSprint.items;
        this.notAssignedUserStories = [];
        for (const response1 of notAssignedUserStoriesGraphqlResponse) {
          const notAssignedUserStory = new UserStory();
          notAssignedUserStory.id = response1.id;
          notAssignedUserStory.state = this.userStoryStatesList.find(state => state.id == response1.stateId)?.itemName;
          notAssignedUserStory.userCode = response1.userCode;
          notAssignedUserStory.shortDescription = response1.shortDescription;
          notAssignedUserStory.urgencyId = response1.urgencyId;
          notAssignedUserStory.urgencyIcon = this.listUrgency.find(urgency => urgency.urgencyId == response1.urgencyId)?.urgencyIcon;
          notAssignedUserStory.progress = response1.progress;
          notAssignedUserStory.storyPoints = +response1.storyPoints;
          notAssignedUserStory.project = response1.project;
          notAssignedUserStory.topic = response1.topic;
          notAssignedUserStory.ticketId = response1.ticketId;
          if (response1.topic && response1.topic.name) {
            notAssignedUserStory.topic.name = response1.topic.name;
          }
          if (response1.sprint && response1.sprint.shortName != null) {
            notAssignedUserStory.sprint.shortName = response1.sprint.shortName;
          }
          notAssignedUserStory.chat_url = response1.chat_url;
          notAssignedUserStory.assignedTasketsNumber = response1.assigned_tickets_number;

          this.notAssignedUserStories.push(notAssignedUserStory);
        }

      },
      err => {
        this.loadingBacklog = false;
        console.log('Something went wrong!', err);
      }
    );
  }

  onDisplaySprint() {
    if (this.spId !== null) {
      this.spId = null;
    }
    this.showSprint = true;
  }

  onHideSprint(event) {
    this.showSprint = event;
    this.spId = null;    // this.sprintTobeEdit

    this.sprintParentId = null;
    this.showChildSprintCreation = false;
  }

  onClickSprint(sprint: Sprint, event): void {
    if (this.showSprint === true) {
      this.showSprint = false;
    } else if (this.sprintParentId !== null) {
      this.sprintParentId = null;
    }
    if (this.spId !== sprint) {
      this.spId = sprint;
      event.stopPropagation();
    } else {
      this.spId = null;
    }
  }

  onCreateChildSprint(sprintParentId: number): void {
    this.sprintParentId = sprintParentId;
    this.showChildSprintCreation = true;
    this.spId = null;
    this.showSprint = false;
    event.stopPropagation();
    this.isOpen = false;
  }


  onTogglePopoverComments(event) {
    if (this.sprintDetailPopover.ticketId) {
      if (this.showPopoverComments === false) {
        this.loadComments();
      }
      this.showPopoverComments = !this.showPopoverComments;
      this.addCommentMode = false;
      this.commentText = '';
    }
    event.stopPropagation();
  }

  onTogglePopoverCommentTextarea(event) {
    event.stopPropagation();
    this.addCommentMode = !this.addCommentMode;
    this.showPopoverComments = false;
  }

  toggleAddCommentMode(event): void {
    event.stopPropagation();
    this.commentText = '';
    this.addCommentMode = !this.addCommentMode;
  }

  onSprintRecentlyAdded(event) {
    this.sprintRecentlyAdded = event;

    // sort + date format
    const sprintStartDate = moment(this.sprintRecentlyAdded.startDate).format('YYYY-MM-DD HH:mm:ss').split(' ');
    this.sprintRecentlyAdded.sprintStartDate = sprintStartDate[0];
    const sprintEndDate = moment(this.sprintRecentlyAdded.endDate).format('YYYY-MM-DD HH:mm:ss').split(' ');
    this.sprintRecentlyAdded.sprintEndDate = sprintEndDate[0];

    this.sprints.push(this.sprintRecentlyAdded);
    this.sprints.sort((a, b) => b.sprintStartDate.localeCompare(a.sprintStartDate));
    this.sprintsOptions.push({
      id: this.sprintRecentlyAdded.id,
      name: this.sprintRecentlyAdded.name || String(this.sprintRecentlyAdded.id),
      sprintStartDate: this.sprintRecentlyAdded.sprintStartDate
    });
    this.sprintsOptions.sort((a, b) => b.sprintStartDate.localeCompare(a.sprintStartDate));


  }

  // get list of project in this prodcut
  private getProjectsByProduct(productId: number): void {
    this.projectService.getAllProjectByProduct(productId).subscribe(dataSource => {
      for (const data of dataSource) {
        const product = new Product();
        // product.productId = data.project_id;
        product.productName = data.project_name;
        this.dropdownProjectsList.push(product.productName);
      }
    });
  }

  private getListState(): void {
    this.stateService.getAllStatusOfSprint()
      .pipe(map((dataSource: any) => dataSource.map(statusItem => {
        const statusOption = new StateOption();
        statusOption.id = statusItem.status_id;
        statusOption.itemName = statusItem.name;
        return statusOption;
      })))
      .subscribe(dataSource => {
        this.allSprintStatusOptions = dataSource;
      });
  }

  getSprintDetail(sprint: Sprint): void {
    this.sprintDetailPopover.id = sprint.id;
    this.sprintDetailPopover.ticketId = sprint.ticketId;
    this.sprintDetailPopover.name = sprint.name;
    this.sprintDetailPopover.state = sprint.state;
    this.sprintDetailPopover.addComment = sprint.addComment;
    this.sprintDetailPopover.chatLinkUrl = sprint.chatLinkUrl;
    this.isScrumMasterOrScrumMasterDeputyBySprint(this.sprintDetailPopover.id);
    this.sprintComments = [];
    this.showPopoverComments = false;
    this.commentText = '';
    this.addCommentMode = false;
    // to do get role by sprint_id and role_id
      const searchSprintMemberInputForDeputyList = {
        sprintId: sprint.id,
        stateId: 1030058
      };
    
    this.usersSMDeputyList = [];
    this.userSM="";
    this.sprintMember.filterSprintMembers(searchSprintMemberInputForDeputyList).subscribe(
      (users) => {
        this.usersSMDeputyList= (users.data.filterSprintMembers.items || [])
        .filter(user =>user.role === 'Scrum master Deputy')
        .map(user => user.userCode);

        this.userSM = (users.data.filterSprintMembers.items || []).find(user => user.role === 'Scrum master')?.userCode;
      }
    );

  }

  addComment(event, comment: string): void {
    if (this.sprintDetailPopover.ticketId) {
      this.commentService.addComment(comment, this.sprintDetailPopover.ticketId).subscribe(dataSource => {
        this.toggleAddCommentMode(event);
        this.loadComments();
      });
    }
  }
  private loadComments(): void {
    this.sprintComments = [];
    if (this.sprintDetailPopover.ticketId) {
      this.commentService.getComments(this.sprintDetailPopover.ticketId).subscribe(comments => {
        for (const data of comments) {
          const comment = new Comment();
          comment.text = data.text;
          comment.authorCode = data.authorCode;
          comment.creationDate = data.creationDate;

          this.sprintComments.push(comment);
        }

      });
    }
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
          console.log('no SM/SMD available by product');
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
          console.log('no SM/SMD available by sprint');
          this.isSMOrSMDBySprint = false;
        }

      });
    });
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
}
