
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { UserStory } from '../models/UserStory';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserStoryServices {

  sharedUserStoryAndTestCaseList = new BehaviorSubject(null);

  public constructor(private http: HttpClient) {
  }
  getUserStoryById(userStoryId): Observable<UserStory> {
    return this.http.get<UserStory>(environment.coreUrl + '/services/request/getJsonData/1000360?param1=' + userStoryId);
  }
  getUserStoryBySprintId(sprintId): Observable<any> {
    return this.http.get<any>(environment.coreUrl + '/services/request/getJsonData/1000317?param1=' + sprintId);
  }
  findUserStoryBySprintIdAndState(sprintId): Observable<any> {
    return this.http.get<any>(environment.coreUrl + '/services/request/getJsonData/1000381?param1=' + sprintId);
  }

  getAttachmentsListByUserStoryId(userStoryId): Observable<any> {
    return this.http.get<any>(environment.coreUrl + '/services/request/getJsonData/1000379?param1=' + userStoryId);
  }

  getAssignedTicketsByUserStoryId(userStoryId): Observable<any> {
    return this.http.get<any>(environment.coreUrl + '/services/request/getJsonData/1000346?param1=' + userStoryId);
  }

  updateUserStoryState(stateId: number, stateName: string, ticketId: number, loggedUserId: number): Observable<any> {
    const obj: any = {};
    obj.state = stateId;
    obj.stateView = stateName;
    obj.ticketId = ticketId;
    obj.loggedUser = loggedUserId;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers.append('Accept', 'application/json;charset=UTF-8');

    const options = { headers: headers };
    return this.http
      .post(`${environment.coreUrl}/services/ticketing/ticket/save?fields=state,stateView,ticketId`, obj, options);
  }

  getAllStatusOfUserStory(): Observable<any> {
    return this.http.get<any>(environment.coreUrl + '/services/request/getJsonData/1000324');
  }
}
