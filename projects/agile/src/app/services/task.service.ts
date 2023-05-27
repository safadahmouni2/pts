
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


import { BaseService } from './base.service';
import { Task } from '../models/task.model';


@Injectable()
export class TaskService extends BaseService {

    constructor(public http: HttpClient) {
        super(http);
    }


    addTasktoUS(usId: number, task: Task, planrealse: string): Observable<any> {
        const obj: any = {};
        if (planrealse !== '') {
            obj.planRelease = planrealse;
        }
        obj.parentTicketId = usId;
        obj.responsibleView = task.responsibleCode;
        obj.typeView = task.type;
        obj.shortDescription = task.text;
        obj.project = task.project;
        obj.urgencyView = task.prio;
        obj.estimatedEffort = task.estimation;
        
        if(sessionStorage.currentUser){
            obj.loggedUser = +JSON.parse(sessionStorage.currentUser).id;
        }

        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        headers.append('Accept', 'application/json;charset=UTF-8');
        const options = { headers: headers };

        return this.callServiceMethodPost('/ticketing/ticket/save', obj);
    }

    getMyTasks(): Observable<any> {
        return this.callServiceMethodGet('/request/getJsonData/1000386');
    }
}
