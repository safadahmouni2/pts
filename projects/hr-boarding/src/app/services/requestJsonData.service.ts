import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class RequestJsonDataService extends BaseService {
  private baseUrl = '/request/getJsonData';

  constructor(public http: HttpClient) {
    super(http);
  }

  getCurrentUser(): Observable<any> {
    return this.callServiceMethodGet(this.baseUrl + '/1000345');
  }
  getBoardingDashboard(): Observable<any> {
    return this.callServiceMethodGet(this.baseUrl + '/1000481?param1=');
  }
  getMyOpenedTasks(): Observable<any> {
    return this.callServiceMethodGet(this.baseUrl + '/1000482');
  }
  getProcessTypes(): Observable<any> {
    return this.callServiceMethodGet(this.baseUrl + '/1000483');
  }
  getTasksByProcessAndCategorieID(processID: number, processCategorieID: number): Observable<any> {
    return this.callServiceMethodGet(this.baseUrl + '/1000485?param1=' + processID + '&param2=' + processCategorieID);
  }
  getTasksTasks(id: number): Observable<any> {
    return this.callServiceMethodGet(this.baseUrl + '/1000484?param1=' + id);
  }
  getProcesDetail(id: number): Observable<any> {
    return this.callServiceMethodGet(this.baseUrl + '/1000481?param1=' + id);

  }
  getDepartements(): Observable<any> {
    return this.callServiceMethodGet(this.baseUrl + '/1000488');
  }
}
