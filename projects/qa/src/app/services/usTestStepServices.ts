import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsTestStep } from '../models/UsTestStep';

@Injectable({
  providedIn: 'root'
})
export class UsTestStepServices {

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
    return this.http.get<UsTestStep[]>(this.baseURL + '/usTestSteps' + '/' + testCaseId);
  }

  addTestStep(usTestStep: UsTestStep): Observable<any> {
    return this.http.post(this.baseURL + '/addUsTestStep', usTestStep, { responseType: 'text' as 'json' });
  }

  updateTestStep(usTestStep: UsTestStep): Observable<any> {
    return this.http.put(this.baseURL + '/editUsTestStep' + '/', usTestStep, { responseType: 'text' as 'json' });
  }

  editTestStepState(id: number, usTestStep: UsTestStep): Observable<any> {
    return this.http.put(this.baseURL + '/editUsStepState' + '/' + id, usTestStep, { responseType: 'text' as 'json' });
  }

  deleteTestStep(id: number): Observable<any> {
    return this.http.delete(this.baseURL + '/deleteUsTestStep' + '/' + id);
  }
}
