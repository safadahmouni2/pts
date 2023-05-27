import { Injectable } from '@angular/core';
import { TestEffort } from '../models/TestEffort';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TestEffortServices {

  private baseURL = `${environment.gatewayUrl}/qa-service`;

  public constructor(private http: HttpClient) {
  }

  addTestEffort(testEffort: TestEffort): Observable<any> {
    return this.http.post(this.baseURL + '/addTestEffort', testEffort, { responseType: 'text' as 'json' });
  }

  editTestEffort(id: number, testEffort: TestEffort): Observable<any> {
    return this.http.put(this.baseURL + '/editTestEffort/' + id, testEffort, { responseType: 'text' as 'json' });
  }

  closeTestEffort(id: number, testEffort: TestEffort): Observable<any> {
    return this.http.put(this.baseURL + '/close-test-efforts/' + id, testEffort, { responseType: 'text' as 'json' });
  }

  finishTestEffort(id: number, testEffort: TestEffort): Observable<any> {
    return this.http.put(this.baseURL + '/finish-test-efforts/' + id, testEffort, { responseType: 'text' as 'json' });
  }

  getAllTestEffortByTestId(testId): Observable<TestEffort[]> {
    return this.http.get<TestEffort[]>(this.baseURL + '/testEffortByTest/' + testId);
  }

  getTotalEffortByTestRunId(testRunId): any {
    return this.http.get<TestEffort[]>(this.baseURL + '/totalTestEffortByTestRun/' + testRunId);
  }

  getLastInCompletedTestEffortByTestRunId(testRunId): any {
    return this.http.get<TestEffort>(this.baseURL + '/last-test-effort/' + testRunId);
  }

  getTotalEffortByTestId(testId): any {
    return this.http.get<TestEffort[]>(this.baseURL + '/totalTestEffortByTest/' + testId);
  }
}
