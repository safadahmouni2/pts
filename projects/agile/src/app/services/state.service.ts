import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseService } from './base.service';

@Injectable()
export class StateService extends BaseService {

  constructor(public http: HttpClient) {
    super(http);
  }
  getAllStatusOfUserStory(): Observable<any> {
    return this.callServiceMethodGet('/request/getJsonData/1000324');
  }
  getStateById(stateId: number): Observable<any> {
    return this.callServiceMethodGet('/request/getJsonData/1000389?param1=' + stateId);
  }
  getAllStatusOfSprint(): Observable<any> {
    return this.callServiceMethodGet('/request/getJsonData/1000565');
  }

  // get allowed states which can be assigned to topic 
  getNextAllowedStatesForTopic(statusId: number): Observable<any> {
    return this.callServiceMethodGet('/request/getJsonData/1000574?param1=' + statusId);

  }
  // get allowed states which can be assigned to feature 
  getNextAllowedStatesForFeature(statusId: number): Observable<any> {
    return this.callServiceMethodGet('/request/getJsonData/1000575?param1=' + statusId);

  }
  // get list of state possible that sprint can be assigned
  getNextAllowedStatesForSprint(statusId: number): Observable<any> {
    return this.callServiceMethodGet('/request/getJsonData/1000562?param1=' + statusId);

  }
}
