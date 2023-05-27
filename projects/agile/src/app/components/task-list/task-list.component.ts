import { Component, OnInit, Input } from '@angular/core';
import { Task } from '../../models/task.model';
import { UserStoryService } from '../../services/userstory.service';
import { DragulaService } from 'ng2-dragula';
import { UserStory } from '../../models/user-story.model';


@Component({
    selector: 'app-task-list',
    templateUrl: './task-list.component.html'
})
export class TaskListComponent implements OnInit {
    @Input() objectId: number;
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('assignedTasksNumber') assignedTasksNumber: number = 0;
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('ischanged') isChanged: number;
    expanded: boolean = false;
    tasks: Task[] = [];
    nonAssignedtasks: Task[] = [];
    constructor(private userStoryService: UserStoryService) {

    }

    ngOnInit() {
        // console.log('ischanged:', this.isChanged);
        this.assignedTasksNumber = this.assignedTasksNumber;

    }


    toggleExpanded(): void {
        if (this.expanded === false) {
            this.getTasks();
        }
        this.expanded = !this.expanded;
    }

    getTasks(): void {
        if (this.objectId) {
            this.userStoryService.getAssignedTasks(this.objectId).subscribe(tasks => {
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
}
