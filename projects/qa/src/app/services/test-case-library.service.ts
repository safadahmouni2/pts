import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpEvent,
  HttpParams,
  HttpParameterCodec
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TestCaseLibrary } from '../models/test-case-library';
import { environment } from '../../environments/environment';
import { CustomHttpParameterCodec } from './encoder';
import { TestCaseLibrarySearchInput } from '../models/TestCaseLibrarySearchInput';

@Injectable({
  providedIn: 'root'
})
export class TestCaseLibraryService {

  private baseURL = `${environment.gatewayUrl}/qa-service`;

  public encoder: HttpParameterCodec = new CustomHttpParameterCodec();

  public defaultHeaders = new HttpHeaders();

  constructor(private httpClient: HttpClient) {
  }

  getAllTestCasesLibrary(): Observable<TestCaseLibrary[]> {
    return this.httpClient.get<TestCaseLibrary[]>(this.baseURL + '/AllTestCasesLibrary');
  }
  getTestCaseLibraryByProductId(productId: number): Observable<TestCaseLibrary[]> {
    return this.httpClient.get<TestCaseLibrary[]>(this.baseURL + '/testCaseLibraryByProductId' + '/' + productId);
  }
  getTestCaseLibraryById(id: number): Observable<TestCaseLibrary> {
    return this.httpClient.get<TestCaseLibrary>(this.baseURL + '/testCaseLibrary' + '/' + id);
  }
  getTestCasesLibraryByFolderId(folderId: number): Observable<TestCaseLibrary[]> {
    return this.httpClient.get<TestCaseLibrary[]>(this.baseURL + '/testCasesLibrary/folder/' + folderId);
  }
  getTestCaseListByUserStoryId(userStoryId: number): Observable<TestCaseLibrary[]> {
    return this.httpClient.get<TestCaseLibrary[]>(this.baseURL + '/usTestCasesByUserStoryId' + '/' + userStoryId);
  }

  public searchForTestCase(searchInput: TestCaseLibrarySearchInput, observe: any = 'body', reportProgress = false, options?: { httpHeaderAccept?: 'application/json;charset&#x3D;UTF-8' }):
    Observable<any> {
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
    let queryParameters = new HttpParams({ encoder: this.encoder });

    if (searchInput.shortDescription) {
      queryParameters = queryParameters.append('shortDescription', searchInput.shortDescription);
    }
    if (searchInput.testCaseLibraryId) {
      queryParameters = queryParameters.append('testCaseLibraryId', searchInput.testCaseLibraryId);
    }
    if (searchInput.folderId) {
      queryParameters = queryParameters.append('folderId', searchInput.folderId.toString());
    }
    if (searchInput.productId) {
      queryParameters = queryParameters.append('productId', searchInput.productId.toString());
    }
    return this.httpClient.get<TestCaseLibrary[]>(`${this.baseURL}/library-test-cases`,
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

  getTestCaseListBySprintId(sprintId: number): Observable<TestCaseLibrary[]> {
    return this.httpClient.get<TestCaseLibrary[]>(this.baseURL + '/LibrarytestCasesBySprintId' + '/' + sprintId);
  }

  addTestCaseLibrary(testCaseLibrary: TestCaseLibrary): Observable<any> {
    return this.httpClient.post(this.baseURL + '/addTestCaseLibrary', testCaseLibrary);
  }

  updateTestCaseLibrary(id: number, testCaseLibrary: TestCaseLibrary): Observable<any> {
    return this.httpClient.put(this.baseURL + '/editTestCaseLibrary' + '/' + id, testCaseLibrary);
  }

  deleteTestCaseLibrary(id: number): Observable<any> {
    return this.httpClient.delete(this.baseURL + '/deleteTestCaseLibrary' + '/' + id);
  }

  filterWithUserStoryState(state: string): Observable<TestCaseLibrary[]> {
    return this.httpClient.get<TestCaseLibrary[]>(this.baseURL + '/filterByUS' + '/' + state);
  }

  public exportProductTestCasesLibrary(productId: number, observe?: 'body', reportProgress?: boolean): Observable<Blob>;
  public exportProductTestCasesLibrary(productId: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Blob>>;
  public exportProductTestCasesLibrary(productId: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Blob>>;
  public exportProductTestCasesLibrary(productId: number, observe: any = 'body', reportProgress = false): Observable<any> {
    if (productId === null || productId === undefined) {
      throw new Error('Required parameter productId was null or undefined when calling exportProductTestCasesLibrary.');
    }

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/vnd.ms-excel');

    return this.httpClient.get(`${this.baseURL}/test-cases-library/export/product/${encodeURIComponent(String(productId))}`,
      {
        responseType: 'blob' as 'json',
        withCredentials: false,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  public exportFolderTestCasesLibrary(folderId: number, folderName: string, observe?: 'body', reportProgress?: boolean): Observable<Blob>;
  public exportFolderTestCasesLibrary(folderId: number, folderName: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Blob>>;
  public exportFolderTestCasesLibrary(folderId: number, folderName: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Blob>>;
  public exportFolderTestCasesLibrary(folderId: number, folderName: string, observe: any = 'body', reportProgress = false): Observable<any> {
    if (folderId === null || folderId === undefined) {
      throw new Error('Required parameter folderId was null or undefined when calling exportFolderTestCasesLibrary.');
    }


    let queryParameters = new HttpParams({ encoder: this.encoder });

    if (folderName !== undefined && folderName !== null) {
      queryParameters = queryParameters.set('folderName', <any>folderName);
    }

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/vnd.ms-excel');

    return this.httpClient.get(`${this.baseURL}/test-cases-library/export/folder/${encodeURIComponent(String(folderId))}`,
      {
        params: queryParameters,
        responseType: 'blob' as 'json',
        withCredentials: false,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  uploadProductExcelFile(selectedSourceSystem, file: File, productId): Observable<any> {
    const formData: FormData = new FormData();
    let queryParameters = new HttpParams({ encoder: this.encoder });
    formData.append('file', file);
    if (selectedSourceSystem) { queryParameters = queryParameters.set('sourceSystem', selectedSourceSystem); }
    return this.httpClient.post(`${this.baseURL}/test-cases-library/importExcel/` + productId, formData
      , { params: queryParameters, withCredentials: false });
  }
  uploadFolderExcelFile(selectedSourceSystem, file: File, productId, folderId): Observable<any> {
    const formData: FormData = new FormData();
    let queryParameters = new HttpParams({ encoder: this.encoder });
    if (productId) {
      queryParameters = queryParameters.set('productId', productId);
    }
    if (selectedSourceSystem) {
      queryParameters = queryParameters.set('sourceSystem', selectedSourceSystem);
    }
    formData.append('file', file);
    return this.httpClient.post(`${this.baseURL}/test-cases-library/importFolderExcel/${encodeURIComponent(String(folderId))}`, formData
      , { params: queryParameters, withCredentials: false });
  }


  dragAndDropTC(dragAndDropTestCaseDTO: any, id): Observable<any> {
    return this.httpClient.put(this.baseURL + '/testCaseLibrary' + '/' + 'dragAndDropTestCase/' + id, dragAndDropTestCaseDTO);
  }
}
