import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import TestStepLibrary from '../models/TestStepLibrary';

@Injectable({
  providedIn: 'root'
})
export class TestStepLibraryServices {

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


  getTestStepsLibraryByTestCaseLibraryId(testCaseLibraryId: number): Observable<TestStepLibrary[]> {
    return this.http.get<TestStepLibrary[]>(this.baseURL + '/testStepsLibrary?testCaseLibraryId=' + testCaseLibraryId);
  }

  addTestStepLibrary(testStepLibrary: TestStepLibrary): Observable<any> {
    return this.http.post(this.baseURL + '/testStepsLibrary', testStepLibrary, { responseType: 'text' as 'json' });
  }

  updateTestStepLibrary(testStepLibrary: TestStepLibrary): Observable<any> {
    return this.http.put(this.baseURL + '/testStepsLibrary' + '/', testStepLibrary);
  }

  editTestStepLibraryState(id: number, testStepLibrary: TestStepLibrary): Observable<any> {
    return this.http.put(this.baseURL + '/testStepsLibrary' + '/' + id, testStepLibrary.testStepState, { responseType: 'text' as 'json' });
  }

  deleteTestStepLibrary(id: number): Observable<any> {
    return this.http.delete(this.baseURL + '/testStepsLibrary' + '/' + id);
  }
}
