import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TestCaseChangeRequest } from '../models/TestCaseChangeRequest';

@Injectable({
  providedIn: 'root'
})
export class TestCaseChangeRequestService {

  private baseURL = `${environment.gatewayUrl}/qa-service`;

  public constructor(private http: HttpClient) {
  }

  addTestCaseChangeRequest(testCaseChangeRequest: TestCaseChangeRequest): Observable<any> {
    return this.http.post(this.baseURL + '/test-case-change-requests', testCaseChangeRequest, { responseType: 'text' as 'json' });
  }

  getCountOfTestCaseChangeRequestByProductId(productId: number): Observable<any> {
    return this.http.get(this.baseURL + `/test-case-change-requests/${encodeURIComponent(Number(productId))}`);
  }

  getTestCaseChangeRequestListByProductId(productId: number): Observable<any> {
    return this.http.get(this.baseURL + '/test-case-change-requests?productId=' + productId);
  }

  treatTestCaseChangeRequest(action: string, id: number): Observable<any> {
    return this.http.post(this.baseURL + `/test-case-change-requests/${encodeURIComponent(String(action))}/${encodeURIComponent(Number(id))}`, { responseType: 'text' as 'json' });
  }
}
