
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TestCaseInput } from '../models/TestCaseInput';
import { UsTestCase } from '../models/UsTestCase';

@Injectable({
  providedIn: 'root'
})
export class UsTestCaseServices {

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



  getTestCaseListByUserStoryId(userStoryId: number): Observable<UsTestCase[]> {
    return this.http.get<UsTestCase[]>(this.baseURL + '/usTestCasesByUserStoryId' + '/' + userStoryId);
  }
  getTestCasesByUserStoryIdList(userStoryListId: number[]): Observable<any> {
    return this.http.get(this.baseURL + '/testCasesByUserStoryList' + '/' + userStoryListId);
  }
  getTestCaseListBySprintId(sprintId: number): Observable<UsTestCase[]> {
    return this.http.get<UsTestCase[]>(this.baseURL + '/usTestCasesBySprintId' + '/' + sprintId);
  }
  filterWithSprintIdAndState(sprintId: number, state: string): Observable<any> {
    return this.http.get<any>(this.baseURL + '/filterByUsTestCaseState' + '/' + sprintId + '/' + state);
  }

  getUsTestCaseByTestCaseLibraryIdAndUserStoryId(testCaseLibraryId: number, userStoryId: number): Observable<UsTestCase> {
    return this.http.get<any>(this.baseURL + '/usTestCase' + '/' + testCaseLibraryId + '/' + userStoryId);
  }
  getTestCaseListByState(state: string): Observable<UsTestCase[]> {
    return this.http.get<UsTestCase[]>(this.baseURL + '/filter' + '/' + state);
  }

  filterWithUserStoryState(state: string): Observable<UsTestCase[]> {
    return this.http.get<UsTestCase[]>(this.baseURL + '/filterByUS' + '/' + state);
  }

  getAllTestCases(): Observable<UsTestCase[]> {
    return this.http.get<UsTestCase[]>(this.baseURL + '/AllUsTestCases');
  }

  getTestCaseById(id: number): Observable<UsTestCase> {
    return this.http.get<UsTestCase>(this.baseURL + '/usTestCase' + '/' + id);
  }
  getTestCasesByFolderId(folderId: number): Observable<UsTestCase> {
    return this.http.get<UsTestCase>(this.baseURL + '/testCases/folder/' + folderId);
  }
  addTestCase(testCase: UsTestCase): Observable<any> {
    return this.http.post(this.baseURL + '/addUsTestCase', testCase, { responseType: 'text' as 'json' });
  }

  updateTestCase(id: number, testCase: UsTestCase): Observable<any> {
    return this.http.put(this.baseURL + '/editUsTestCase' + '/' + id, testCase, { responseType: 'text' as 'json' });
  }

  deleteTestCase(id: number): Observable<any> {
    return this.http.delete(this.baseURL + '/deleteUsTestCase' + '/' + id);
  }

  deleteUsTestCaseByTestCaseLibraryIdAndUserStoryId(testCaseLibraryId: number, userStoryId: number): Observable<any> {
    return this.http.delete(this.baseURL + '/deleteUsTestCaseByIdTcAndIdUs' + '/' + testCaseLibraryId + '/' + userStoryId);
  }

  copyTestCase(testCaseInput: TestCaseInput): Observable<any> {
    return this.http.post(this.baseURL + '/copyUsTestCase', testCaseInput, { responseType: 'text' as 'json' });
  }

}
