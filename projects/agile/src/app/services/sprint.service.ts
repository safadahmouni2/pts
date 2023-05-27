import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseService } from './base.service';

@Injectable()
export class SprintService extends BaseService {

  constructor(public http: HttpClient) {
    super(http);
  }

  /**
   * @deprecated The method should not be used
   */
  private getSprintsInProgress(): Observable<any> {
    return this.callServiceMethodGet('/request/getJsonData/1000316');
  }

  /**
   * @deprecated The method should not be used
   */
  private getSprintsByProduct(id_product: number): Observable<any> {
    return this.callServiceMethodGet('/request/getJsonData/1000323?param1=' + id_product);
  }

  /**
   * @deprecated The method should not be used
   */
  private getAllSprintsByProduct(id_product: string): Observable<any> {
    return this.callServiceMethodGet('/request/getJsonData/1000350?param1=' + id_product);
  }

  /**
   * @deprecated The method should not be used
   */ 
  
  private getSprintDetails(sprintId): Observable<any> {
    return this.callServiceMethodGet('/request/getJsonData/1000321?param1=' + sprintId);
  }

  private getSprintProgress(sprintId): Observable<any> {
    return this.callServiceMethodGet('/request/getJsonData/1000329?param1=' + sprintId);
  }

   /**
   * @deprecated The method should not be used
   */
  private getMyDailyScrums(): Observable<any> {
    return this.callServiceMethodGet('/request/getJsonData/1000357');
  }

  /**
   * @deprecated The method should not be used
   */
  private getOpenedSprintsByProduct(id_product: number, stateSprintsList: string): Observable<any> {
    return this.callServiceMethodGet('/request/getJsonData/1000376?param1=' + id_product + '&param2=' + stateSprintsList);
  }

  getSprintName(sprintId): Observable<any> {
    return this.callServiceMethodGet('/request/getJsonData/1000377?param1=' + sprintId);
  }

  // get Sprints by product where status in progress and planned
  getMySprintsByProduct(id_product: number): Observable<any> {
    return this.callServiceMethodGet('/request/getJsonData/1000383?param1=' + id_product);
  }

  /**
   * @deprecated The method should not be used
   */
  // get Sprints by product where status in progress and planned
  private getStatusCountUsBySprint(sprintId: number): Observable<any> {
    return this.callServiceMethodGet('/request/getJsonData/1000381?param1=' + sprintId);
  }
  getProductBySprintsId(sprintId): Observable<any> {
    return this.callServiceMethodGet('/request/getJsonData/1000330?param1=' + sprintId);
  }

  /**
   * @deprecated The method should not be used
   */
  private getSprintFieldsBySprintId(sprintId: number): Observable<any> {
    return this.callServiceMethodGet('/request/getJsonData/1000560?param1=' + sprintId);
  }
}
