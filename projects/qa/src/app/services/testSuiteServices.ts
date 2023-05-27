import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TestSuiteServices {

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
  getTestSuitesListByProductId(productId: number): Observable<any[]> {
    return this.http.get<any[]>(this.baseURL + '/getTestSuiteLibraryByProductId' + '/' + productId);
  }
  getTestCaseLibraryByTestSuiteId(testSuiteId: number): Observable<any[]> {
    return this.http.get<any[]>(this.baseURL + '/testCaseLibraryByTestSuiteLibraryId' + '/' + testSuiteId);
  }
}
