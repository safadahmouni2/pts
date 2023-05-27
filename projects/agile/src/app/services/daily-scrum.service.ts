import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import DateTimeFormat = Intl.DateTimeFormat;
import * as moment from 'moment';
import { BaseService } from './base.service';

@Injectable()
export class DailyScrumService extends BaseService {

  constructor(public http: HttpClient) {
    super(http);
  }

  /**
   * @deprecated The method should not be used
   */  
  private getCurrentDailyScrum(sprintId: number): Observable<any> {
    return this.callServiceMethodGet('/request/getJsonData/1000340?param1=' + sprintId);
  }

}
