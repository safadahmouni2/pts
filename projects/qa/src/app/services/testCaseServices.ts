
import { Injectable } from '@angular/core';
import { TestCase } from '../models/TestCase';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TestCaseInput } from '../models/TestCaseInput';

@Injectable({
  providedIn: 'root'
})
export class TestCaseServices {

  private baseURL = `${environment.gatewayUrl}/qa-service`;

  headers = new HttpHeaders();
  options;
  optionsWithAccept;
  headersWithAcccept = new HttpHeaders({ 'Content-Type': 'application/json' });
  public constructor(private http: HttpClient) {
    this.options = { headers: this.headers };
    this.options = { headers: this.headers };
    this.headersWithAcccept.append('Accept', 'application/json;charset=UTF-8');
    this.optionsWithAccept = { headers: this.headersWithAcccept };
  }



  getTestCaseListByUserStoryId(userStoryId: number): Observable<TestCase[]> {
    return this.http.get<TestCase[]>(this.baseURL + '/usTestCasesByUserStoryId' + '/' + userStoryId);
  }
  getTestCaseListBySprintId(sprintId: number): Observable<TestCase[]> {
    return this.http.get<TestCase[]>(this.baseURL + '/usTestCasesBySprintId' + '/' + sprintId);
  }
  filterWithSprintIdAndState(sprintId: number, state: string): Observable<any> {
    return this.http.get<any>(this.baseURL + '/filter' + '/' + sprintId + '/' + state);
  }
  getTestCaseListByState(state: string): Observable<TestCase[]> {
    return this.http.get<TestCase[]>(this.baseURL + '/filter' + '/' + state);
  }

  filterWithUserStoryState(state: string): Observable<TestCase[]> {
    return this.http.get<TestCase[]>(this.baseURL + '/filterByUS' + '/' + state);
  }

  getAllTestCases(): Observable<TestCase[]> {
    return this.http.get<TestCase[]>(this.baseURL + '/AllTestCases');
  }

  getTestCaseById(id: number): Observable<TestCase> {
    return this.http.get<TestCase>(this.baseURL + '/testCase' + '/' + id);
  }
  getTestCasesByFolderId(folderId: number): Observable<TestCase> {
    return this.http.get<TestCase>(this.baseURL + '/testCases/folder/' + folderId);
  }
  addTestCase(testCase: TestCase): Observable<any> {
    return this.http.post(this.baseURL + '/addTestCase', testCase, { responseType: 'text' as 'json' });
  }

  updateTestCase(id: number, testCase: TestCase): Observable<any> {
    return this.http.put(this.baseURL + '/editTestCase' + '/' + id, testCase, { responseType: 'text' as 'json' });
  }

  deleteTestCase(id: number): Observable<any> {
    return this.http.delete(this.baseURL + '/deleteTestCase' + '/' + id);
  }

  copyTestCase(testCaseInput: TestCaseInput): Observable<any> {
    return this.http.post(this.baseURL + '/copyTestCase', testCaseInput, { responseType: 'text' as 'json' });
  }
  getTestCasesByUserStoryIdList(userStoryListId: any[]): Observable<any> {
    return this.http.get(this.baseURL + '/testCasesByUserStoryList' + '/' + userStoryListId);
  }
  getUsTestCaseByTestCaseLibraryIdAndUserStoryId(testCaseLibraryId: any, userStoryId: any): Observable<any> {
    return this.http.get(this.baseURL + '/usTestCase' + '/' + testCaseLibraryId + '/' + userStoryId)
  }

}
