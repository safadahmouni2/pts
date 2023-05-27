import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseService } from './base.service';



@Injectable()
export class ProjectService extends BaseService {

  constructor(public http: HttpClient) {
    // call base contructor
    super(http);
  }

  getAllProjectByProduct(productId: number): Observable<any> {
    return this.callServiceMethodGet('/request/getJsonData/1000367?param1=' + productId);
  }
}
