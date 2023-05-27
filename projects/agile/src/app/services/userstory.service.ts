
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


import { BaseService } from './base.service';
import { UserStory } from '../models/user-story.model';
import { BehaviorSubject } from 'rxjs';
import { Speaker } from '../models/speaker.model';


@Injectable()
export class UserStoryService extends BaseService {
    
    private isUserSpeaking$ = new BehaviorSubject<any>(false);
    public speaker$ = new BehaviorSubject<Speaker>(null);

    selectedUserSpeaker$ = this.isUserSpeaking$.asObservable();
    constructor(public http: HttpClient) {
        // call base contructor
        super(http);
    }

    //**pass :isSpeaker boolean variable of sepakingUser to highlighting user in userstory component*/
    setIsUserSpeaking(isSpeaker: boolean, speaker:Speaker) {
        this.isUserSpeaking$.next(isSpeaker);
        this.speaker$.next(speaker);
    }

    /* Get List User Story by Topoic*/
    /**
      * @deprecated The method should not be used
      */
    private  getListUserStoryByTopic(topic_id: any, product_id: any): Observable<any> {
        // add specific parameters

        // call web service
        // product_id :1017818
        return this.callServiceMethodGet('/request/getJsonData/1000343?param1=' + product_id + '&param2=' + topic_id);
    }
    /* Get List User Story by Topoic*/

    private getListUserStoryByFeature(product_id: any, feature_id: any): Observable<any> {
        // add specific parameters

        // call web service
        // product_id :1017818
        return this.callServiceMethodGet('/request/getJsonData/1000577?param1=' + product_id + '&param2=' + feature_id);
    }

    // Uses http.get() to load JSON file
    getUserStoriesBySprint(sprintid: number): Observable<any> {
        return this.callServiceMethodGet('/request/getJsonData/1000317?param1=' + sprintid);
    }

    // Uses http.get() to load JSON file
    private getUserStoriesBySprintAndStatusList(sprintId: number, statusList: {}): Observable<any> {
        return this.callServiceMethodGet('/request/getJsonData/1000333?param1=' + sprintId + '&param2=' + statusList);
    }

    getDsDashboardColumns(): Observable<any> {
        return this.callServiceMethodGet('/request/getJsonData/1000332');
    }

    updateUserStoryState(stateId: number, stateName: string, ticketId: number): Observable<any> {
        const obj: any = {};
        obj.state = stateId;
        obj.stateView = stateName;
        obj.ticketId = ticketId;
        if (sessionStorage.currentUser) {
            obj.loggedUser = +JSON.parse(sessionStorage.currentUser).id;
        }
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        headers.append('Accept', 'application/json;charset=UTF-8');
        const options = { headers: headers };

        return this.callServiceMethodPost('/ticketing/ticket/save?fields=state,stateView,ticketId', obj);
    }

    getAssignedTasks(parentId: number): Observable<any> {
        return this.callServiceMethodGet('/request/getJsonData/1000346?param1=' + parentId);
    }

    getUnAssignedTasks(productId: number): Observable<any> {
        return this.callServiceMethodGet('/request/getJsonData/1000373?param1=' + productId);
    }

    private getUSByProductIdWithoutSprint(productid: number): Observable<any> {
        return this.callServiceMethodGet('/request/getJsonData/1000366?param1=' + productid);
    }
    
    /**
      * @deprecated The method should not be used
      */
    private getUSByProductIdWithoutTopic(productid: number): Observable<any> {
        return this.callServiceMethodGet('/request/getJsonData/1000571?param1=' + productid);
    }

    private getUSByProductIdWithoutFeature(productid: number): Observable<any> {
        return this.callServiceMethodGet('/request/getJsonData/1000576?param1=' + productid);
    }

    // get list of userstories by sprint and state
    getListUserStoryByState(sprintId: any, status_id: any): Observable<any> {

        return this.callServiceMethodGet('/request/getJsonData/1000378?param1=' + sprintId + '&param2=' + status_id);

    }
    // get list of state possible that user story can be assigned
    getListState(status_id: any): Observable<any> {
        return this.callServiceMethodGet('/request/getJsonData/1000375?param1=' + status_id);
    }

    assignTaskToUserStory(ticketId: number, usId: number): Observable<any> {
        const obj: any = {};
        obj.ticketId = ticketId;
        obj.amount1 = usId;
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        headers.append('Accept', 'application/json;charset=UTF-8');
        const options = { headers: headers };
        return this.callServiceMethodPost('/ticketing/ticket/save?fields=ticketId,amount1', obj);
    }



    getAttachement(usId: number): Observable<any> {
        return this.callServiceMethodGet('/request/getJsonData/1000379?param1=' + usId);
    }

    // Uses http.get() to load JSON file
    private getMyUserStories(): Observable<any> {
        return this.callServiceMethodGet('/request/getJsonData/1000382');
    }
    /* getCountAssignedTasks(usId: any): Observable<any> {
         return this.callServiceMethodGet('/request/getJsonData/1000388?param1=' + usId);
     }*/

    /*  getAllState(): Observable<any> {
      return this.callServiceMethodGet('/request/getJsonData/1000385');
    }*/
    getPlanrealsebyProduct(project: any): Observable<any> {
        return this.callServiceMethodGet('/request/getJsonData/1000542?param1=' + project + '&searchTerm');
    }
    getUserstoryPointsDsbySprint(sprintId: any): Observable<any> {
        return this.callServiceMethodGet('/request/getJsonData/1000543?param1=' + sprintId);
    }

    getTaskStates(type_name: any , state_id:  any): Observable<any> {
        return this.callServiceMethodGet('/request/getJsonData/1000585?param1=' + type_name + '&param2=' + state_id);
    }
}
