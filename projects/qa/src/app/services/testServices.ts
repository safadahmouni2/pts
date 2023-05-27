import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams, HttpParameterCodec } from '@angular/common/http';
import { Test } from '../models/Test';
import { CustomHttpParameterCodec } from './encoder';

@Injectable({
  providedIn: 'root'
})
export class TestServices {

  public sharedShowEdit = new BehaviorSubject(null);
  public encoder: HttpParameterCodec = new CustomHttpParameterCodec();
  public defaultHeaders = new HttpHeaders();

  private baseURL = `${environment.gatewayUrl}/qa-service`;

  private testURL = `${this.baseURL}/tests`;

  public constructor(private httpClient: HttpClient) {
  }

  updateTest(test: any): Observable<any> {
    return this.httpClient.put(`${this.baseURL}/tests/updateTest`, test, { responseType: 'text' as 'json' });
  }
  editTestState(id: number, test: Test): Observable<any> {
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling editTestState.');
    }
    return this.httpClient.put(`${this.baseURL}/tests/editState/${encodeURIComponent(String(id))}`, test, { responseType: 'text' as 'json' });
  }

  countByTestRunIdAndState(testRunId, state): Observable<number> {
    return this.httpClient.get<number>(`${this.baseURL}/tests/${encodeURIComponent(String(testRunId))}/${encodeURIComponent(String(state))}`);
  }
  getTestsByUserStoryId(userStoryId) {
    if (userStoryId === null || userStoryId === undefined) {
      throw new Error('Required parameter userStoryId was null or undefined when calling getTestsByUserStoryId.');
    }
    return this.httpClient.get<any>(`${this.baseURL}/tests/${encodeURIComponent(String(userStoryId))}`);
  }

  public findTests(userStoryId: number, testCaseLibraryId: number, observe: any = 'body', reportProgress = false, options?: { httpHeaderAccept?: 'application/json;charset&#x3D;UTF-8' }): Observable<any> {
    let queryParameters = new HttpParams({ encoder: this.encoder });
    if (userStoryId !== undefined && userStoryId !== null) {
      queryParameters = this.addToHttpParams(queryParameters,
        <any>userStoryId, 'userStoryId');
    }

    if (testCaseLibraryId !== undefined && testCaseLibraryId !== null) {
      queryParameters = this.addToHttpParams(queryParameters,
        <any>testCaseLibraryId, 'testCaseLibraryId');
    }

    let headers = this.defaultHeaders;

    let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
    if (httpHeaderAcceptSelected === undefined) {
      httpHeaderAcceptSelected = 'application/json;charset=UTF-8';
    }
    if (httpHeaderAcceptSelected !== undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }


    let responseType: 'text' | 'json' = 'json';
    if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
      responseType = 'text';
    }


    return this.httpClient.get<any>(`${this.baseURL}/tests`,
      {
        params: queryParameters,
        responseType: <any>responseType,
        withCredentials: false,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  private addToHttpParams(httpParams: HttpParams, value: any, key?: string): HttpParams {
    if (typeof value === 'object' && value instanceof Date === false) {
      httpParams = this.addToHttpParamsRecursive(httpParams, value);
    } else {
      httpParams = this.addToHttpParamsRecursive(httpParams, value, key);
    }
    return httpParams;
  }

  private addToHttpParamsRecursive(httpParams: HttpParams, value?: any, key?: string): HttpParams {
    if (value == null) {
      return httpParams;
    }

    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        (value as any[]).forEach(elem => httpParams = this.addToHttpParamsRecursive(httpParams, elem, key));
      } else if (value instanceof Date) {
        if (key != null) {
          httpParams = httpParams.append(key,
            (value as Date).toISOString().substr(0, 10));
        } else {
          throw Error("key may not be null if value is Date");
        }
      } else {
        Object.keys(value).forEach(k => httpParams = this.addToHttpParamsRecursive(
          httpParams, value[k], key != null ? `${key}.${k}` : k));
      }
    } else if (key != null) {
      httpParams = httpParams.append(key, value);
    } else {
      throw Error("key may not be null if value is not object or array");
    }
    return httpParams;
  }

  getTestsByTestRun(testRunId: number): Observable<any> {
    return this.httpClient.get<any>(`${this.baseURL}/tests/testRun/` + testRunId);
  }
  getTestResult(userStoryId: number, tcId: number): Observable<any> {
    return this.httpClient.get<any>(this.testURL + `/testResult/` + userStoryId + '/' + tcId);
  }

}
