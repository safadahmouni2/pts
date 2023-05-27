import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class DocumentTestCaseLibraryService {

  private baseURL = `${environment.gatewayUrl}/qa-service`;

  public constructor(private http: HttpClient) {
  }
  upload(file: File, testId): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);
    const req = new HttpRequest('POST', `${this.baseURL}/documentTestCaseLibrarys/upload` + '/' + testId, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }
  download(testCaseLibraryId: any): Observable<Blob> {
    return this.http.get(`${this.baseURL}/documentTestCaseLibrarys/download` + '/' + testCaseLibraryId, {
      responseType: 'blob'
    });
  }
  getFilesByTestCaseLibrary(testCaseLibraryId: any) {
    return this.http.get<any[]>(this.baseURL + '/documentTestCaseLibrarys/' + testCaseLibraryId);

  }
  updateDocTestCaseLibrary(id, doc: any): Observable<any> {
    return this.http.put(this.baseURL + '/documentTestCaseLibrarys' + '/editDocumentTestCaseLibrary' + '/' + id, doc);

  }
  deleteDocumentTestCaseLibrary(id: number): Observable<any> {
    return this.http.delete(this.baseURL + '/documentTestCaseLibrarys' + '/deleteDocumentTestCaseLibrary' + '/' + id);
  }
}