import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SprintsService {

  public constructor(private http: HttpClient) {
  }
  private getSprintsByIdProduct(productId): Observable<any[]> {
    return this.http.get<any[]>(environment.coreUrl + '/services/request/getJsonData/1000383?param1=' + productId);
  }

  getAllSprintStates(): Observable<any> {
    return this.http.get<any[]>(environment.coreUrl + '/services/request/getJsonData/1000565')
  }
}
