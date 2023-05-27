import { Component, OnInit, Input, Output, EventEmitter, Injector, OnChanges, SimpleChanges } from '@angular/core';
import { Task } from '../../models/task.model';
import { UserService, UserStoryService } from '../../services';
import { State } from '../../models/state.model';
import { UserStoryGrapgQlService } from '../../services/pts-api/agile/user-story.service';
import { ToastrService } from 'ngx-toastr';
import { finalize, takeUntil } from 'rxjs';

@Component({
    selector: 'app-task',
    templateUrl: './task.component.html'
})
export class TaskComponent implements OnInit , OnChanges {
    @Input() task: Task;
    expanded: boolean = false;
    @Input() options: any = { showResponsible: true, showLink: false, canEditTaskState: false };
    private DEFAULT_OPTIONS = {
        showResponsible: true,
        showLink: false,
        canEditTaskState: false
    };
    dropdownTaskStates: State[] = [];

    isStateEdit: boolean = false;
    serverpath: string = 'https://pts.thinktank.de';
    editTask: boolean = false;
    canStateEdit: boolean = false;
    stateIdSelected: number;
    stateNameSelected: string;
    toastrService: ToastrService
    saveTaskLoading: boolean;
    constructor(private userStoryService: UserStoryService,
        private userService: UserService,
        private userStoryGrapgQlService: UserStoryGrapgQlService,
        protected injector: Injector) {
        this.toastrService = this.injector.get(ToastrService);
    }

    ngOnInit() {

    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.options) {
            this.options = { ...this.DEFAULT_OPTIONS, ...this.options };
        }
    }

    openUrlBody(id: any) {
        const url = '/pages/ticket/dynamicTicket.jsp?ticketId=' + id;
        window.open(url);
        event.stopPropagation();
    }
    onClick(id: any) {
        const url = this.serverpath + '/executeWelcomRequest.do?requestId=12&param4=' + id;
        window.open(url, 'PTS');
        this.editTask = true;
    }

    toggleExpanded(): void {
        this.expanded = !this.expanded;
    }

    onOpenStateEdit(event, task) {

        if (this.options.canEditTaskState && task.type != 'User story') {
            event.stopPropagation();
            // this.onLoadStates.emit(null);
            this.loadTaskStates(task)
            this.isStateEdit = !this.isStateEdit;
            this.stateIdSelected = +task.stateId;
        }
    }

    getStateName(stateSelected: any) {
        const stateObject = stateSelected.split(';');
        this.stateIdSelected = stateObject[0];
        this.stateNameSelected = stateObject[1];
    }

    toogleEditTaskState(isSaved: boolean, event, task): void {
        event.stopPropagation();
        this.dropdownTaskStates = [];
        if (isSaved && task.type != 'User Story') {
            this.updateTaskState(task);
        }
        this.isStateEdit = !this.isStateEdit;
    }

    private updateTaskState(task): void {
        this.saveTaskLoading  = true;

        this.userStoryService.updateUserStoryState(this.stateIdSelected, this.stateNameSelected, task.id)
           .pipe(
              finalize(() => {
               this.saveTaskLoading = false;
              })
            )
            .subscribe(result => {
                this.canStateEdit = !this.canStateEdit;
                this.task.stateId = this.stateIdSelected;
                this.task.state = this.stateNameSelected;
                if (this.stateNameSelected == 'FW as User story') {
                    this.addUserStory();
                }
            }, error => {
                console.log(error)
                const currentError = new Error('[API Network error]: Error when update task state!');

                const toastOptions = {
                    enableHtml: true,
                    closeButton: true,
                    progressBar: false,
                    tapToDismiss: false,
                    disableTimeOut: true,
                    enableBootstrap: true,
                    positionClass: 'toast-top-full-width'
                };
                this.toastrService.error(error.message ? error.message : error.toString(), null, toastOptions);
                console.error(`${currentError} \n ${error}`);
            });

    }

    private loadTaskStates(task): void {
        this.saveTaskLoading  = true;
        this.userStoryService.getTaskStates(task.type, task.stateId)
        .pipe(
            finalize(() => {
             this.saveTaskLoading = false;
            })
         )
        .subscribe(dataSource => {
            const listState: State[] = [];
            for (const data of dataSource) {
                const stateCmb = new State();
                stateCmb.stateId = data.status_id;
                stateCmb.stateName = data.status_name;
                listState.push(stateCmb);

            }
            this.dropdownTaskStates = listState;
        });
    }

    addUserStory() {
        const phrase = this.task.text.split(">>>")[0].trim();
        const userStoryInputData = {
            productId: this.task.productId,
            stateId: 1017772, //inital state: created
            parentTicketId: this.task.id,
            shortDescription: phrase,
            project: this.task?.project || null
        };
        this.userStoryGrapgQlService.createUserStory(userStoryInputData)
            .subscribe(() => {
            });
    }

}
