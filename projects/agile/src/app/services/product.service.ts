import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseService } from './base.service';

@Injectable()
export class ProductService extends BaseService {

  constructor(public http: HttpClient) {
    super(http);
  }

  // Uses http.get() to load JSON file
  getProductBySprintsId(sprintId): Observable<any> {
    return this.callServiceMethodGet('/request/getJsonData/1000330?param1=' + sprintId);
  }

  // get Products of logged user

  getMyProducts(): Observable<any> {
    return this.callServiceMethodGet('/request/getJsonData/1000348');
  }

  // Get List Product By Id
  public getListProductById(productId: any): Observable<any> {
    return this.callServiceMethodGet('/request/getJsonData/1000356?param1=' + productId);
  }

}
