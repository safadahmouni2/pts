import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TestCaseChanges } from '../models/TestCaseChanges';

@Injectable({
  providedIn: 'root'
})
export class TestCaseChangesService {

  private baseURL = `${environment.gatewayUrl}/qa-service`;

  public constructor(private http: HttpClient) {
  }

  addTestCaseChanges(testCaseChanges: TestCaseChanges): Observable<any> {
    return this.http.post(this.baseURL + '/test-case-changes', testCaseChanges, { responseType: 'text' as 'json' });
  }

  getTestCaseChangesByTestCaseChangeRequestId(testCaseChangeChangeRequestId: number): Observable<any> {
    return this.http.get(this.baseURL + '/test-case-changes?testCaseChangeRequestId=' + testCaseChangeChangeRequestId);
  }

  updateTestCaseChanges(testCaseChanges: TestCaseChanges): Observable<any> {
    return this.http.put(this.baseURL + '/test-case-changes/' + testCaseChanges.id, testCaseChanges, { responseType: 'text' as 'json' });
  }


}
