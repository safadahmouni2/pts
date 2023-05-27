import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserStoryService } from '../../services/userstory.service';
import { ProductService } from '../../services/product.service';
import { SprintService } from '../../services/sprint.service';
import { UserStory } from '../../models/user-story.model';
import { Task } from '../../models/task.model';
import { Product } from '../../models/product.model';
import { DragulaService, DragulaOptions } from 'ng2-dragula';

interface CustomDragulaOptions<T = any> extends DragulaOptions<T> {
    moves?: (el: Element, container: Element, handle: Element) => boolean;
}
@Component({
    selector: 'app-sprint-planning',
    templateUrl: './sprint-planning.component.html'
})
export class SprintPlanningComponent implements OnInit {
    usId: any;
    sprintid: number;
    sprintname: string;
    expandBar: boolean = false;
    displaySearch: boolean = false;
    userStories: UserStory[] = [];
    nonAssignedtasks: Task[] = [];
    product: Product = new Product();
    amount1: number;
    parentId: number;
    userStoryChangeState: UserStory;
    // eslint-disable-next-line @angular-eslint/no-output-rename
    @Output('onNotifyState') notify: EventEmitter<UserStory> = new EventEmitter<UserStory>();



    constructor(private userStoryService: UserStoryService,
        private productService: ProductService,
        private sprintService: SprintService,
        private dragulaService: DragulaService,
        private route: ActivatedRoute,
        private router: Router) {

        const bag: any = this.dragulaService.find('nested-bag');
        if (bag !== undefined) {
            this.dragulaService.destroy('nested-bag');
        }

        const options: CustomDragulaOptions = {
            copySortSource: false,
            moves: (el, container, handle) => handle.classList.contains('handle')
        };
        dragulaService.createGroup('nested-bag', options);

        dragulaService.drop().subscribe((value) => {
            this.onDropModel(value);
        });

    }
    onChangeState(userStory: UserStory): void {

        this.userStoryChangeState = userStory;
        this.userStories.filter(userItem => {
            if (userItem.id === this.userStoryChangeState.id) {
                userItem.state = this.userStoryChangeState.state;
            }
        });
    }

    private onDropModel(args: any): void {

        const ticketId = args.el.dataset.id;
        // eslint-disable-next-line eqeqeq
        if (args.source != args.target) {
            let usID = null;
            if (args.el.dataset.us == null) {
                usID = this.usId;
            }
            this.userStoryService.assignTaskToUserStory(ticketId, usID).subscribe(
                (data) => {
                }, (err) => {
                }
            );
        }
        // let sprint = target.dataset;
    }


    ngOnInit() {
        this.route.params.subscribe(params => {
            this.sprintid = params['id'];
        });

        this.sprintService.getSprintName(this.sprintid).subscribe(data => {
            this.sprintname = data[0].Name;
        });

        this.getUnAssignedTasks();
        this.userStoryService.getUserStoriesBySprint(this.sprintid).subscribe(userStories => {
            this.userStories = [];
            for (const data of userStories) {
                const userStory = new UserStory();
                userStory.id = data.id;
                userStory.stateId = data.stateId;
                userStory.state = data.state;
                userStory.text = data.text;
                userStory.responsible = data.responsible;
                userStory.storyPoints = data.storyPoints;
                userStory.projectName = data.projectName;
                userStory.topicName = data.topic_name;
                userStory.springShortName = data.ps_name;
                userStory.chat_url = data.chat_url;
                userStory.assignedTasketsNumber = data.assigned_tickets_number;


                this.userStories.push(userStory);
            }
            /*if (this.userStories.length) {
                this.selectUS(userStories[0].id);
            }*/
        },
            err => {
                console.log('Something went wrong!', err);
            }
        );



    }
    toogleExpandToDoBar(): void {
        this.expandBar = !this.expandBar;
    }
    toogleDisplaySearch(): void {
        this.displaySearch = !this.displaySearch;
    }
    selectUS(id: any): void {
        this.usId = id;
    }


    getUnAssignedTasks(): void {
        this.productService.getProductBySprintsId(this.sprintid).subscribe(datasource => {
            this.product.productId = datasource[0].id;
            this.product.productName = datasource[0].name;
            this.userStoryService.getUnAssignedTasks(this.product.productId).subscribe(tasks => {
                this.nonAssignedtasks = [];
                for (const data of tasks) {
                    const task = new Task();
                    task.id = data.id;
                    task.text = data.text;
                    task.state = data.status;
                    task.type = data.type;
                    task.responsibleCode = data.resp_code;
                    this.nonAssignedtasks.push(task);
                }
            }
            );
        });

    }

    hideDetail(): void {
        this.usId = null;
        this.sprintid = null;

    }

}
