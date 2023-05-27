import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseService } from './base.service';
import { Sprint } from '../models/index.model';
import * as moment from 'moment';

@Injectable()
export class UserService extends BaseService {
  constructor(public http: HttpClient) {
    super(http);
  }


  /**
  * @deprecated The method should not be used
  */
  private getUsersBySprint(sprintid: number): Observable<any> {
    return this.callServiceMethodGet('/request/getJsonData/1000318?param1=' + sprintid);
  }
  
  /**
  * @deprecated The method should not be used
  */
  private getUsersCodeByObject(ticketId: number): Observable<any> {
    return this.callServiceMethodGet('/request/getJsonData/1000371?param1=' + ticketId);
  }

  /**
  * @deprecated The method should not be used
  */
  private getListTeamAndParticipants(sprintId: number, dsId: number): Observable<any> {
    return this.callServiceMethodGet('/request/getJsonData/1000334?param1=' + sprintId + '&param2=' + dsId);
  }
  
  /**
  * @deprecated The method should not be used
  */
  private getListParticipantsAndSprintTeam(sprintId: number, dsId: number): Observable<any> {
    return this.callServiceMethodGet('/request/getJsonData/1000564?param1=' + sprintId + '&param2=' + dsId);
  }

  getSpeakingUser(sprintId: number, dsId: number): Observable<any> {
    return this.callServiceMethodGet('/request/getJsonData/1000358?param1=' + sprintId + '&param2=' + dsId);
  }


  getCurrentUserState(userId: number, dsId: number): Observable<any> {
    return this.callServiceMethodGet('/request/getJsonData/1000342?param1=' + userId + '&param2=' + dsId);
  }


  getCurrentUser(): Observable<any> {
    return this.callServiceMethodGet('/request/getJsonData/1000345');
  }

  private getUserRoleBySprint(userId: number, sprintId: number): Observable<any> {
    return this.callServiceMethodGet('/request/getJsonData/1000339?param1=' + userId + '&param2=' + sprintId);
  }

  private getUserRoleSprintMemberBySprint(sprintId: number, userId: number): Observable<any> {
    return this.callServiceMethodGet('/request/getJsonData/1000558?param1=' + sprintId + '&param2=' + userId);
  }

  getUsersBySprintIdAndRoleId(sprintId: number, roleId: number): Observable<any> {
    return this.callServiceMethodGet('/request/getJsonData/1000568?param1=' + sprintId + '&param2=' + roleId);
  }

  private getSprintMemberBySprint(sprintId: number, userId: number, roleId: number): Observable<any> {
    return this.callServiceMethodGet('/request/getJsonData/1000567?param1=' + sprintId + '&param2=' + userId + '&param3=' + roleId);
  }

  // Get user roles in product team
  public getUserRolesInProductTeam(productId: number, userId: number): Observable<any> {
    return this.callServiceMethodGet('/request/getJsonData/1000557?param1=' + productId + '&param2=' + userId);
  }

  // Get list not assigned roles to user in sprint
  private getListNotAssignedRolesToUserInSprint(userId, sprintId): Observable<any> {
    return this.callServiceMethodGet('/request/getJsonData/1000559?param1=' + userId + '&param2=' + sprintId);
  }

  // Get list not assigned roles to user in sprint
  private searchListNotAssignedRolesToUserInSprintByQuery(userId, sprintId, query): Observable<any> {
    return this.callServiceMethodGet('/request/getJsonData/1000563?param1=' + userId + '&param2=' + sprintId + '&param3=' + query);
  }

  // Get list roles to user in product 
  public searchAllRolesByProductIdAndQuery(productId: number, query: string = ''): Observable<any> {
    return this.callServiceMethodGet('/request/getJsonData/1000573?param1=' + productId + '&param2=' + query);
  }

  // Get list product team
  public getproductTeam(productName: string): Observable<any> {
    return this.callServiceMethodGet('/request/getJsonData/1000372?param1=' + productName);
  }

  // get list Scrum master and Scrum master deputy by product
  public getListScrumMasterAndScrumMasterDeputyByProduct(productId: number): Observable<any> {
    return this.callServiceMethodGet('/request/getJsonData/1000561?param1=' + productId);
  }

  // get list Scrum master and Scrum master deputy by sprint
  public getListScrumMasterAndScrumMasterDeputyBySprint(sprintId: number): Observable<any> {
    return this.callServiceMethodGet('/request/getJsonData/1000566?param1=' + sprintId);
  }
}

