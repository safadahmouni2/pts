import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TestStep } from '../models/TestStep';

@Injectable({
  providedIn: 'root'
})
export class TestStepServices {

  private baseURL = `${environment.gatewayUrl}/qa-service`;

  headers = new HttpHeaders();
  options;
  optionsWithAccept;
  headersWithAccept = new HttpHeaders({ 'Content-Type': 'application/json' });

  public constructor(private http: HttpClient) {
    this.options = { headers: this.headers };
    this.options = { headers: this.headers };
    this.headersWithAccept.append('Accept', 'application/json;charset=UTF-8');
    this.optionsWithAccept = { headers: this.headersWithAccept };
  }


  getTestStepsByTestCaseId(testCaseId: number) {
    return this.http.get<TestStep[]>(this.baseURL + '/testSteps' + '/' + testCaseId);
  }
  getTestStepsByTestId(testId: number) {
    return this.http.get<TestStep[]>(this.baseURL + '/testStepsByTestId' + '/' + testId);
  }
  addTestStep(testStep: TestStep): Observable<any> {
    return this.http.post(this.baseURL + '/addTestStep', testStep, { responseType: 'text' as 'json' });
  }

  updateTestStep(testStep: TestStep): Observable<any> {
    return this.http.put(this.baseURL + '/editTestStep' + '/', testStep, { responseType: 'text' as 'json' });
  }

  editTestStepState(id: number, testStep: TestStep): Observable<any> {
    return this.http.put(this.baseURL + '/editStepState' + '/' + id, testStep, { responseType: 'text' as 'json' });
  }

  deleteTestStep(id: number): Observable<any> {
    return this.http.delete(this.baseURL + '/deleteTestStep' + '/' + id);
  }
}
