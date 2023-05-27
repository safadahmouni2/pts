
import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { Topic } from '../../models/topic.model';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ProjectService } from '../../services/project.service';
import { TopicGrapgQlService } from '../../services/pts-api/agile/topic.service';
import { DefaultTopicGrapgQlService } from '../../services/pts-api/agile/default-topic.service';
import { finalize, Subject, takeUntil } from 'rxjs';
import { DefaultTopic } from '../../models/default-topic.model';
import { cloneDeep } from '@apollo/client/utilities';
import { State } from '../../models/state.model';
import { map } from 'rxjs/operators';
import { StateService } from '../../services/state.service';
import { CommentService } from '../../services/comment.service';
import { Comment } from '../../models/comment.model';

@Component({
  selector: 'app-topic-detail',
  templateUrl: './topic-detail.component.html',
})
export class TopicDetailComponent implements OnInit, OnDestroy {
  comments: any[];
  editState: boolean;
  showFieldButton: string;
  showStatusDropdown: any;
  editModeState: boolean;
  stateName: any;
  savedStateName: any;
  savedStateId: any;
  allowedStatesList: any;
  destroy$ = new Subject();
  editMode = false;
  editModeProject = false;
  editModeName = false;
  editModeDescription = false;
  isChecked: boolean = false;
  displaySprintDetailView: boolean;
  productIdSelected: number;
  projectSelected: any;
  dropdownListProduct: Product[] = [];
  description: any;
  oldTopic: any;
  projectName: any;
  editableTopic: any;
  dataLoading = false;
  expanded: boolean = false;
  addCommentMode: boolean = false;
  commentsExpanded: boolean = false;
  comment: string;
  addComment: boolean = false;
  config: any = {};

  // eslint-disable-next-line @angular-eslint/no-output-rename
  @Output('onhideTopicDetail') nofiy: EventEmitter<Topic> = new EventEmitter<Topic>();
  @Input() myProduct: Product;
  @Input() topic: Topic;

  constructor(private productService: ProductService,
    private projectService: ProjectService,
    private topicGrapgQlService: TopicGrapgQlService,
    private defaultTopicGrapgQlService: DefaultTopicGrapgQlService,
    private stateService: StateService,
    private commentService: CommentService,
) { 
          // Toolbar configuration generated automatically by the editor based on config.toolbarGroups.
          this.config.toolbar = [
            {
                name: 'clipboard',
                groups: ['clipboard', 'undo'],
                items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo']
            },
            {
                name: 'editing',
                groups: ['find', 'selection', 'spellchecker'],
                items: ['Scayt']
            },
            {
                name: 'links',
                items: ['Link', 'Unlink', 'Anchor']
            },
            {
                name: 'insert',
                items: ['Image', 'Table', 'HorizontalRule', 'SpecialChar']
            },
            {
                name: 'document',
                groups: ['mode', 'document', 'doctools'],
                items: ['Source']
            },
            { name: 'others', items: ['-'] },
            '/',
            {
                name: 'basicstyles',
                groups: ['basicstyles', 'cleanup'],
                items: ['Bold', 'Italic', 'Strike', '-', 'RemoveFormat']
            },
            {
                name: 'paragraph',
                groups: ['list', 'indent', 'blocks', 'align', 'bidi'],
                items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote']
            },
            {
                name: 'styles',
                items: ['Styles', 'Format']
            }
        ];

        // Toolbar groups configuration.
        this.config.toolbarGroups = [
            { name: 'clipboard', groups: ['clipboard', 'undo'] },
            { name: 'editing', groups: ['find', 'selection', 'spellchecker'] },
            { name: 'links' },
            { name: 'insert' },
            { name: 'forms' },
            { name: 'document', groups: ['mode', 'document', 'doctools'] },
            { name: 'others' },
            '/',
            { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
            { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi'] },
            { name: 'styles' },
            { name: 'colors' }
        ];
}

  ngOnInit(): void {
    this.oldTopic = cloneDeep(this.topic);
    this.editableTopic = cloneDeep(this.oldTopic);
    this.getListPoject();
    this.isDefaultTopic();
    this.productIdSelected = this.myProduct.productId;
    this.dataLoading = true;
    this.topicGrapgQlService.getTopicsById(this.topic.id)
      .pipe(takeUntil(this.destroy$),
        finalize(() => this.dataLoading = false)).
      subscribe(topic => {
        if (topic) {
          this.oldTopic = topic.data.getTopic;
          this.editableTopic = cloneDeep(this.oldTopic);
          this.getNextAllowedStates(this.oldTopic.stateId);
         this.getStateName(this.oldTopic.stateId);
                         // load us comments
                         this.getComments();
        }
      });
   
  }
  ngOnDestroy(): void {
    this.destroy$.next(undefined);
    this.destroy$.complete();
  }
  public onCloseTopicDetail() {
    this.nofiy.emit(null);
    this.editableTopic = cloneDeep(this.oldTopic);
  }
  public updateTopicDescription() {
    this.editModeDescription = false;
    const topicInputData = {
      description: this.editableTopic.description,
    };
    this.updateTopic(topicInputData);
    this.oldTopic.description = topicInputData.description;
  }
  public onToggleClick() {
    this.isChecked = !this.isChecked;
    if (this.isChecked) {
      this.saveDefaultTopic();
    } else {
      this.deleteDefaultTopic();
    }
  }

  public onClick() {
    this.nofiy.emit(null);
    this.editableTopic = cloneDeep(this.oldTopic);
  }
  public updateTopicProject() {
    this.editModeProject = false;
    const topicInputData = {
      project: this.editableTopic.project,
    };

    this.updateTopic(topicInputData);
    this.oldTopic.project = topicInputData.project;
  }

  public updateTopicName() {
    this.editModeName = false;
    const topicInputData = {
      name: this.editableTopic.name
    };
    this.updateTopic(topicInputData);
    this.oldTopic.name = topicInputData.name;
    this.oldTopic.text = topicInputData.name;
    this.topic.text = topicInputData.name;
  }
  private isDefaultTopic(): void {
    this.defaultTopicGrapgQlService.isDefaultTopic(this.oldTopic.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result.data.isDefaultTopic == true) {
          this.isChecked = true;
        }
      });
  }

  
  private getListPoject(): void {

    this.projectService.getAllProjectByProduct(this.myProduct.productId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(projectsData => {
        this.dropdownListProduct = (projectsData || []).map(item => ({
          id: item.project_id,
          name: item.project_name
        }));
      });

  }
  private updateTopic(topicInputData) {
    this.topicGrapgQlService.updateTopic(this.topic.id, topicInputData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((resultUpdateTopic) => {
        const dataSource = resultUpdateTopic.data.updateTopic;
      });
  }
  saveDefaultTopic(): void {
    this.defaultTopicGrapgQlService.getDefaultTopicByProductId(this.productIdSelected)
      .subscribe(result => {
        if (result.data.getDefaultTopicByProductId != null) {
          this.deleteDefaultTopic();
        }
        const defaultTopic = new DefaultTopic();
        defaultTopic.productId = this.productIdSelected;
        defaultTopic.topicId = this.oldTopic.id
        this.defaultTopicGrapgQlService.createDefaultTopic(defaultTopic).pipe(
          takeUntil(this.destroy$)
        ).subscribe((data) => {
          const dataSource = data.data.createDefaultTopic;
          this.topic.id = dataSource.topicId;
          this.productIdSelected = dataSource.productId;
        });
      });
  }
  deleteDefaultTopic(): void {
    this.defaultTopicGrapgQlService.deleteDefaultTopic(this.productIdSelected).pipe(
      takeUntil(this.destroy$)
    ).subscribe((data) => {
      const dataSource = data.data.createDefaultTopic;
    });

  }

  /*function  : restore data         */
  public restoreData(dataKey) {
    switch (dataKey) {
      case 'description': {
        this.editableTopic.description = this.oldTopic.description;
        this.editModeDescription = false;
        break;
      }
      case 'name': {
        this.editableTopic.name = this.oldTopic.name;
        this.editModeName = false;
        break;
      }
      case 'project': {
        this.editableTopic.project = this.oldTopic.project;
        this.editModeProject = false;
        break;
      }
    }
  }
  /*  function : cahnge data*/
  public changeData(dataKey) {
    switch (dataKey) {
      case 'project':
        this.editModeProject = true;
        break;
      case 'name':
        this.editModeName = true;
        break;
      case 'description':
        this.editModeDescription = true;
        break;

    }
  }

  public getNextAllowedStates(stateId: number) {
     this.stateService.getNextAllowedStatesForTopic(stateId).pipe(map((dataSource: any) => dataSource.map(stateItem => {
      const state = new State();
      state.stateId = stateItem.status_id;
      state.stateName = stateItem.status_name;
      return state;
    })))
    .subscribe(states => {
      this.allowedStatesList = states;
    });
        }

  changeStatusValue(state) {
    for (const data of this.allowedStatesList) {
      if (data.stateName == state) {
        this.editableTopic.stateId = data.stateId;
      }
    }
  }

  public updateStateTopic() {
    const topicInputData = {
      stateId: this.editableTopic.stateId,
    };

    this.updateTopic(topicInputData);
    this.getStateName(topicInputData.stateId);
    this.oldTopic.stateId = topicInputData.stateId;
    
  }
  
  getStateName(stateId) {
      this.stateService.getStateById(stateId).subscribe(state => {
        if(state){
          this.stateName = state[0].statusName;
        }
      });
    }

  toogleEditState(isSaved: boolean): void {
   this.getNextAllowedStates(this.oldTopic.stateId);
    if (isSaved) {
        this.updateStateTopic();
    }
    this.editState = !this.editState;
}

toogleAddComment(): void {
  if (this.topic?.ticketId) {
      this.comment = '';
      this.addComment = !this.addComment;
  }
}

addCommentToTopic(comment: string): void {
  if (this.topic.ticketId) {
      this.commentService.addComment(comment, this.topic.ticketId).subscribe(dataSource => {
          this.addComment = false;
          this.getComments();
      });
  }

}

getComments(): void {
  this.commentService.getComments(this.topic.ticketId).subscribe(comments => {
      this.comments = [];
      for (const data of comments) {
          const comment = new Comment();
          comment.text = data.text;
          comment.authorCode = data.authorCode;
          comment.creationDate = data.creationDate;
          this.comments.push(comment);
      }

  });
}
}
