import { Component, OnInit, ViewContainerRef, Input, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserStoryService } from '../../services/userstory.service';
import { UserStory } from '../../models/user-story.model';
import { State } from '../../models/state.model';
import { ToastrService, ToastContainerDirective } from 'ngx-toastr';
import { DragulaService, DragulaOptions } from 'ng2-dragula';
import { User } from '../../models/index.model';
import { ProductService } from '../../services/product.service';

import { StateService } from '../../services/state.service';
import { Speaker } from '../../models/speaker.model';

interface CustomDragulaOptions<T = any> extends DragulaOptions<T> {
  moves?: (el: Element, container: Element, handle: Element) => boolean;
}

@Component({
  selector: 'app-management-qm',
  templateUrl: './management-qm.component.html'
})
export class ManagementQmComponent implements OnInit, AfterViewInit, OnDestroy {
  usId: any;
  sprintId: number;
  stateId: number;
  stateName: string;
  activate: boolean = true;
  @Input() currentUser: any;
  speaker:Speaker = { id: -1, code: '' , userId : null};
  currentUserId: number = +JSON.parse(sessionStorage.currentUser).id;
  currentUserCode: string = JSON.parse(sessionStorage.currentUser).usercode;
  UserStories: UserStory[] = [];
  productName: string;
  status: State[] = [];
  userStorySearch: string;
  strSearchinput: string;
  private dropSubscription: any;
  private dragSubscription: any;

  @ViewChild(ToastContainerDirective, { static: true })
  toastContainer: ToastContainerDirective;

  constructor(private userStoryService: UserStoryService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private dragulaService: DragulaService,
    public toastr: ToastrService, vcr: ViewContainerRef,
    private router: Router,
    private stateService: StateService) {

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

  ngAfterViewInit(): void {
    this.toastr.overlayContainer = this.toastContainer;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.sprintId = params['sprintId'];
      this.stateId = params['stateId'];
    });
    // console.log(this.sprintId);
    this.productService.getProductBySprintsId(this.sprintId).subscribe(response => {
      for (const item of response) {
        this.productName = item.name;
      }
    });
    this.stateService.getStateById(this.stateId).subscribe(response => {
      if (response.length > 0) {
        this.stateName = response[0].statusName;
      }
    });
    this.userStoryService.getListUserStoryByState(this.sprintId, this.stateId).subscribe(resp => {
      this.UserStories = [];


      for (const item of resp) {
        const userStory = new UserStory();

        userStory.id = item.ticketId;
        userStory.stateId = item.stateId;
        userStory.state = item.state;
        userStory.text = item.shortDescription;
        userStory.responsible = item.responsible;
        userStory.storyPoints = item.storypoints;
        userStory.urgencyIcon = item.urgencyIcon;
        userStory.progress = item.progress;
        userStory.projectName = item.projectName;
        userStory.topicName = item.topic_name;
        userStory.springShortName = item.ps_name;
        userStory.chat_url = item.chat_url;
        userStory.assignedTasketsNumber = item.assigned_tickets_number;

        // console.log(userStory);
        this.UserStories.push(userStory);

      }
    });
    this.userStoryService.getListState(this.stateId).subscribe(response => {
      this.status = [];
      for (const sateItem of response) {
        const state = new State();
        state.stateId = sateItem.status_id;
        state.stateName = sateItem.status_name;
        this.status.push(state);
        this.userStoryService.getListUserStoryByState(this.sprintId, state.stateId).subscribe(resp => {
          state.userStories = [];


          for (const usItem of resp) {
            const userStory = new UserStory();

            userStory.id = usItem.ticketId;
            userStory.stateId = state.stateId;
            userStory.state = usItem.state;
            userStory.text = usItem.shortDescription;
            userStory.responsible = usItem.responsible;
            userStory.storyPoints = usItem.storypoints;
            userStory.urgencyIcon = usItem.urgencyIcon;
            userStory.progress = usItem.progress;
            userStory.projectName = usItem.projectName;
            userStory.topicName = usItem.topic_name;
            userStory.springShortName = usItem.ps_name;
            userStory.chat_url = usItem.chat_url;
            userStory.assignedTasketsNumber = usItem.assigned_tickets_number;

            state.userStories.push(userStory);

          }

        });
        // console.log(state.userStories);
        // console.log(this.status);



      }



    });


  }

  ngOnDestroy() {
    this.dropSubscription.unsubscribe();
    this.dragSubscription.unsubscribe();
  }
  private onDragModel(args: any, user: User): void {

    if (!this.activate) {
      this.toastr.error(
        'Click to activate drag and drop',
        null,
        { enableHtml: true, positionClass: 'toast-bottom-right', closeButton: true }
      );
      this.dragulaService.find('nested-bag').drake.cancel(true);

    }
  }
  private onDropModel(args: any): void {
    const elm = args.el;
    let newStateId, newStateName, ticketId, oldStateId, oldStateName;
    oldStateId = +args.source.dataset.stateid;
    oldStateName = args.source.dataset.statename;
    newStateId = +args.target.dataset.stateid;
    newStateName = args.target.dataset.statename;
    ticketId = +elm.dataset.id;

    this.userStoryService.updateUserStoryState(newStateId, newStateName, ticketId).subscribe(
      (data) => {

        for (const state of this.status) {
          for (const userStory of state.userStories) {
            if (userStory.id === data.data.ticketId) {
              userStory.stateId = data.data.stateId;
              userStory.state = data.data.stateView;
              userStory.responsible = data.data.responsibleView;
            }
          }
        }
        for (const userStory of this.UserStories) {
          if (userStory.id === data.data.ticketId) {
            userStory.stateId = data.data.stateId;
            userStory.state = data.data.stateView;
            userStory.responsible = data.data.responsibleView;
          }
        }

      }, (err) => {
        console.log('erreur', err);
        this.toastr.error(
          'You can not change state from ' + oldStateName + ' to ' + newStateName,
          null,
          { enableHtml: true, positionClass: 'toast-top-center', closeButton: true }
        );
        this.dragulaService.find('nested-bag').drake.cancel(true);
        for (const state of this.status) {
          this.userStoryService.getListUserStoryByState(this.sprintId, state.stateId).subscribe(resp => {
            state.userStories = [];
            for (const item of resp) {
              const userStory = new UserStory();

              userStory.id = item.ticketId;
              userStory.stateId = state.stateId;
              userStory.state = item.state;
              userStory.text = item.shortDescription;
              userStory.responsible = item.responsible;
              userStory.storyPoints = item.storypoints;
              userStory.urgencyIcon = item.urgencyIcon;
              userStory.progress = item.progress;

              state.userStories.push(userStory);

            }

          });
        }
        this.userStoryService.getListUserStoryByState(this.sprintId, this.stateId).subscribe(resp => {
          this.UserStories = [];


          for (const item of resp) {
            const userStory = new UserStory();

            userStory.id = item.ticketId;
            userStory.stateId = item.stateId;
            userStory.state = item.state;
            userStory.text = item.shortDescription;
            userStory.responsible = item.responsible;
            userStory.storyPoints = item.storypoints;
            userStory.urgencyIcon = item.urgencyIcon;
            userStory.progress = item.progress;
            // console.log(userStory);
            this.UserStories.push(userStory);

          }
        });

      },
      () => console.log('Done'));


  }





  onSearchUserStory() {
    this.strSearchinput = this.userStorySearch;
  }

  ShowDetail(userStory: UserStory): void {
    this.usId = userStory.id;
  }

  hideDetail(): void {
    this.usId = null;
  }

}
