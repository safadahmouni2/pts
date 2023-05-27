import { dailyScrum } from './../../services/pts-api/agile/ds-participant.fields';
import { Component, OnInit, Input, OnChanges, SimpleChange, Output, EventEmitter } from '@angular/core';
import { UserStory } from '../../models/user-story.model';
import { Comment } from '../../models/comment.model';
import { PReleaseModel } from '../../models/p-release.model';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { UserService } from '../../services/user.service';
import { UserStoryService } from '../../services/userstory.service';
import { CommentService } from '../../services/comment.service';
import { BaseService } from '../../services/base.service';
import { Attachment } from '../../models/attachment.model';
import { State } from '../../models/state.model';
import { PrioService } from '../../services/prio.service';
import { ProjectService } from '../../services/project.service';
import { Urgency } from '../../models/urgency.model';
import { Product } from '../../models/product.model';
import { UserStoryGrapgQlService } from '../../services/pts-api/agile/user-story.service';
import { StateService } from '../../services/state.service';
import { finalize } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { SprintMemberGraphQlService } from '../../services/pts-api/agile/sprint-member.service';

@Component({
    selector: 'app-us-detail',
    templateUrl: './us-detail.component.html'
})
export class UsDetailComponent implements OnInit, OnChanges {

    users: any;
    Current_USER: number;
    @Input() usId: any;
    @Input() isDailyScrum: boolean = false;
    task: Task = new Task();

    value: string;
    usDetails: UserStory;
    acceptanceCriteria: string;
    _longDescription: string;
    editAcceptanceCriteria: boolean = false;
    addComment: boolean = false;
    addTask: boolean = false;
    editLongDescription: boolean = false;
    comment: string;
    serverpath: string = 'https://pts.thinktank.de';
    comments: Comment[] = [];
    tasks: Task[] = [];
    usersCode: string[] = [];
    projectsList: string[] = [];
    config: any = {};
    storyPoints: number = 0;
    ui_complexity: number = 0;
    bl_complexity: number = 0;
    di_complexity: number = 0;
    testing_complexity: number = 0;
    viewDesc: boolean = false;
    attachments: Attachment[];
    editResponsible: boolean = false;
    editStatus: boolean = false;
    dropdownListState: State[] = [];
    dropdownListUrgency: Urgency[] = [];
    savedStateName: string;
    savedStateId: number;
    // savedUrgencyId :  number;
    savedUrgencyName: string;
    savedUrgencyIcon: string;
    defaultPrio: string = 'assets/img/default_prio_icn.png';
    srcUrgencyIcon: string;
    plans: any = [];
    allStatusOfUserStory = [];
    planrealse: string = '';
    saveTaskLoading: boolean;
    productTeamMembers = [];
    // eslint-disable-next-line @angular-eslint/no-output-rename, @angular-eslint/no-output-native, @angular-eslint/no-output-on-prefix
    @Output('onNotify') change: EventEmitter<UserStory> = new EventEmitter<UserStory>();
    // eslint-disable-next-line @angular-eslint/no-output-rename, @angular-eslint/no-output-on-prefix
    @Output('onHideDetail') nofiy: EventEmitter<UserStory> = new EventEmitter<UserStory>();
    taskOptions = { canEditTaskState: true };
    constructor(
        private stateService: StateService,
        private prioService: PrioService,
        private projectService: ProjectService,
        private baseService: BaseService,
        private userStoryService: UserStoryService,
        private userService: UserService,
        private taskService: TaskService,
        private commentService: CommentService,
        private userStoryGrapgQlService: UserStoryGrapgQlService,
        public productService: ProductService,
        private sprintMemberGrapgQlService: SprintMemberGraphQlService,
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


    ngOnInit() {
        this.getAllStatusOfUserStory();
        this.task.responsibleCode = '';
        this.task.prio = '';
        this.task.project = '';
    }
    onClick() {
        this.nofiy.emit(null);
    }

    notify(userStory: UserStory) {
        this.change.emit(userStory);
    }
    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        this.acceptanceCriteria = '';
        this.addComment = false;
        this.storyPoints = 0;
        this.ui_complexity = 0;
        this.bl_complexity = 0;
        this.di_complexity = 0;
        this.testing_complexity = 0;
        this.usDetails = new UserStory();
        this.usId = changes.usId.currentValue;

        this.userStoryGrapgQlService.getUserStoryDetails(this.usId)
            .subscribe(us => {
                this.usDetails = us.data.getUserStoryDetails;
     
                this.getListUrgency();
                this.getTasks();
                this.getAttachement();     
                // load us comments
                this.getComments();

                this.editLongDescription = false;
                this.editAcceptanceCriteria = false;
                this.viewDesc = false;
                this.addTask = false;

                this.getUserCodeList();

                this.productService.getListProductById(this.usDetails.productId).subscribe(data => {
                    if (data[0]?.product_name) {
                        this.usDetails.productName = data[0]?.product_name;
                        this.plans = [];
                        this.userStoryService.getPlanrealsebyProduct(this.usDetails.productName).subscribe(res => {
                            for (const data of res) {
                                if (data.status === 'WORKING') {
                                    this.plans.push(data.label);
                                }
                            }
                        });
                        this.userService.getproductTeam(data[0]?.product_name).subscribe(result => {
                            this.usDetails.userPhoto = result.find(item => item.user_code === this.usDetails.userCode)?.photo;
                            this.productTeamMembers = result;
                        });
                    } 
                })




            });

    }

    toogleEditAcceptanceCriteria(): void {
        this.acceptanceCriteria = this.usDetails.acceptanceCriteria;
        this.editAcceptanceCriteria = !this.editAcceptanceCriteria;
    }

    toogleAddComment(): void {
        if (this.usDetails?.ticketId) {
            this.comment = '';
            this.addComment = !this.addComment;
        }
    }

    toogleDesc(): void {
        this.viewDesc = !this.viewDesc;
    }


    toogleEditLongDescription(): void {
        this._longDescription = this.usDetails.description;
        this.editLongDescription = !this.editLongDescription;
    }

    toogleEditResponsible(isSaved: boolean): void {
        const urgencyId = this.dropdownListUrgency.find(urgency => urgency.urgencyName == this.savedUrgencyName)?.urgencyId

        if (isSaved) {
            const userStoryInputData = {
                urgencyId: urgencyId
            };

            this.userStoryGrapgQlService.updateUserStory(this.usDetails.id, userStoryInputData)
                .pipe(
                    finalize(() => {
                    })
                )
                .subscribe(() => {
                    if (urgencyId) {
                        const urgencyIcon = this.dropdownListUrgency.find(urgency => urgency.urgencyId == urgencyId)?.urgencyIcon;
                        this.srcUrgencyIcon = this.serverpath + urgencyIcon;
                    } else {
                        this.srcUrgencyIcon = this.defaultPrio;
                    }
                });

        }
        this.editResponsible = !this.editResponsible;
    }

    toogleEditStatus(isSaved: boolean): void {

        this.dropdownListState = [];
        this.getListState();
        if (isSaved) {

            this.userService.getCurrentUser().subscribe(dataSource => {
                this.updateUserStory("stateId", this.savedStateId);
            });
        }
        this.editStatus = !this.editStatus;
    }

    addCommentToUS(comment: string): void {
        if (this.usDetails.ticketId) {
            this.commentService.addComment(comment, this.usDetails.ticketId).subscribe(dataSource => {
                this.addComment = false;
                this.getComments();
            });
        }

    }

    getComments(): void {
        this.commentService.getComments(this.usDetails.ticketId).subscribe(comments => {
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

    updateUserStory(paramname: string, paramvalue: any): void {
        const obj = {};
        obj[paramname] = paramvalue;
        this.userService.getCurrentUser().subscribe(currentUserData => {
            this.userStoryGrapgQlService.updateUserStory(this.usId, obj)
                .subscribe(result => {
                    this.usDetails = result.data.updateUserStory;
                });
        });
    }
    getTasks(): void {
        if (this.usDetails.ticketId) {
            this.userStoryService.getAssignedTasks(this.usDetails.ticketId).subscribe(tasks => {
                this.tasks = [];
                for (const data of tasks) {
                    const task = new Task();
                    task.id = data.id;
                    task.text = data.short_description;
                    task.type = data.type_name;
                    task.responsibleCode = data.resp_code;
                    task.state = data.state_name;
                    task.stateId = data.status_id;
                    task.productId = data.productId;
                    this.tasks.push(task);
                }

            });
        }
    }

    onSelectionChange(): void {
        this.storyPoints = +this.ui_complexity + +this.bl_complexity + +this.di_complexity + +this.testing_complexity;
    }
    updateLongDescription(): void {
        this.updateUserStory("longDescription", this._longDescription);
        this.toogleEditLongDescription();
    }
    updateAcceptanceCriteria(): void {
        this.updateUserStory("acceptanceCriteria", this.acceptanceCriteria);
        this.toogleEditAcceptanceCriteria();
    }

    onSelectTaskType(taskType: string, groupTask: any): void {
        groupTask.isOpen = true;
        this.addTask = true;
        this.saveTaskLoading = false;
        this.task.text = '';
        this.value = taskType.charAt(0);
        this.task.type = taskType;
        this.getListUrgency();
        this.getProjectList();
    }

    getUserCodeList(): void {
        if (this.usDetails?.id) {
            const searchSprintMemberInput = {
                sprintId: this.usDetails?.sprint?.id,

            };
            this.sprintMemberGrapgQlService.filterSprintMembers(searchSprintMemberInput).subscribe(data => {
                 this.users = data.data.filterSprintMembers.items;

                for (const data of this.users) {
                    if (!this.usersCode.includes(data.userCode)) {
                        this.usersCode.push(data.userCode);
                    }
                }

            },
                err => {
                    console.log('Something went wrong!', err);
                }
            );
            // this.userService.getUsersCodeByObject(this.usDetails.id).subscribe(listcode => {
            //     for (const data of listcode) {
            //         if (!this.usersCode.includes(data.code)) {
            //             this.usersCode.push(data.code);
            //         }
            //     }
            // }
            // );
        }
    }


    private getProjectList(): void {

        this.projectService.getAllProjectByProduct(this.usDetails.productId).subscribe(dataSource => {
            for (const data of dataSource) {
                const product = new Product();
                // product.productId = data.project_id;
                product.productName = data.project_name;
                this.projectsList.push(product.productName);
            }
        });
    }



    onSaveTask(): void {
        this.saveTaskLoading = true;
        this.taskService.addTasktoUS(this.usDetails.ticketId, this.task, this.planrealse).subscribe(
            (datasource) => {
                this.addTask = false;
                this.getTasks();
            },
            (err) => {
                console.log('Task Save Error', err);
                this.saveTaskLoading = false;
            },
            () => {
                console.log('Task Saved');
                this.planrealse = '';
                this.saveTaskLoading = false;
            }
        );


    }

    onCancel(): void {
        this.task.text = '';
        this.task.estimation = '';
        this.task.prio = '';
        this.task.project = '';
        this.userStoryService.getAssignedTasks(this.usDetails.id);
    }



    uploadDoc(e: Event) {
        const target: HTMLInputElement = e.target as HTMLInputElement;
        for (let i = 0; i < target.files.length; i++) {
            this.baseService.upload(target.files[i], this.usDetails.ticketId, this.getAttachement.bind(this));


        }

    }

    getAttachement() {
        this.userStoryService.getAttachement(this.usDetails.ticketId).subscribe(attachments => {
            this.attachments = [];
            for (const data of attachments) {
                const attachment = new Attachment();
                attachment.id = data.id;
                attachment.name = data.name;
                attachment.date = data.upload_date;
                this.attachments.push(attachment);
            }

        });
    }
    private getListState(): void {

        this.userStoryService.getListState(this.usDetails.stateId).subscribe(dataSource => {
            const listState: State[] = [];
            for (const data of dataSource) {
                const stateCmb = new State();
                stateCmb.stateId = data.status_id;
                stateCmb.stateName = data.status_name;
                listState.push(stateCmb);

            }
            this.dropdownListState = listState;
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
            this.dropdownListUrgency = listUrgency;

            // init us urgency
            if (this.usDetails.urgencyId) {
                const urgencyIcon = this.dropdownListUrgency.find(urgency => urgency.urgencyId == this.usDetails.urgencyId)?.urgencyIcon;
                this.srcUrgencyIcon = this.serverpath + urgencyIcon;
            } else {
                this.srcUrgencyIcon = this.defaultPrio;
            }
        });

    }

    getStateName(stateSelected: any) {

        const stateObject = stateSelected.split(';');
        this.savedStateId = stateObject[0];
        this.savedStateName = stateObject[1];

    }
    getUrgencySelected(urgencySelected: any) {

        const urgencyObject = urgencySelected.split(';');
        console.log('urgencySelecte')
        console.log(urgencySelected)
        this.savedUrgencyName = urgencyObject[0];
        this.savedUrgencyIcon = urgencyObject[1];

    }

    getStateNameByStateId(status_id: number): string {
        return this.allStatusOfUserStory.find(obj => obj.status_id === status_id)?.name;
    }

    private getAllStatusOfUserStory(): void {
        this.stateService.getAllStatusOfUserStory().subscribe(states => {
            if (states) {
                this.allStatusOfUserStory = states;
            }
        });
    }

    addUserStory() {
        this.saveTaskLoading = true;
        const user = this.getSprintMemberUserData(this.task.responsibleCode);
        const userStoryInputData = {
            productId: this.usDetails?.productId,
            stateId: 1017772, //inital state: created
            parentTicketId: this.usDetails?.ticketId,
            parentUsTicketId: this.usDetails?.ticketId,
            shortDescription: this.task?.text,
            userCode: user?.user_code,
            responsibleId: user?.user_id ,
            urgencyId: this.dropdownListUrgency.find(urgency => urgency.urgencyName == this.task.prio)?.urgencyId,
            project : this.task?.project || null
            };
        this.userStoryGrapgQlService.createUserStory(userStoryInputData)
            .subscribe(() => {
                this.addTask = false;
                this.saveTaskLoading = false;
            });
    }

    onAddTask() {
        if (this.task.type == "User story") {
            this.addUserStory();
        } else {
            this.onSaveTask();
        }
    }

    getSprintMemberUserData(userCode: string) {
        return userCode ? this.productTeamMembers.find(item => item.user_code === userCode) : null;
      }
}
