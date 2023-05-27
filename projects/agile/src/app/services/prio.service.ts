import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseService } from './base.service';

@Injectable()
export class PrioService extends BaseService {

  constructor(public http: HttpClient) {
    super(http);
  }
  getAllPrioOfUserStory(): Observable<any> {
    return this.callServiceMethodGet('/request/getJsonData/1000387');
  }
}
