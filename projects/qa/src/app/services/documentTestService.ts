import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DocumentTestService {
  private baseURL = `${environment.gatewayUrl}/qa-service`;

  public constructor(private http: HttpClient) {
  }
  upload(file: File, testId): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    const req = new HttpRequest('POST', `${this.baseURL}/testDocuments/upload` + '/' + testId, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }
  download(testId: any): Observable<Blob> {
    return this.http.get(`${this.baseURL}/testDocuments/download` + '/' + testId, {
      responseType: 'blob'
    });
  }
  getFilesByTest(testId: any) {
    return this.http.get<any[]>(this.baseURL + '/testDocuments/' + testId);

  }

  updateTestDoc(id, doc: any): Observable<any> {
    return this.http.put(this.baseURL + '/testDocuments/editTestDocument' + '/' + id, doc);

  }
  deleteDocumentTest(id: number): Observable<any> {
    return this.http.delete(this.baseURL + '/testDocuments/deleteTestDocument' + '/' + id);
  }
}
