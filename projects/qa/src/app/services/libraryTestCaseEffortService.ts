import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { LibraryTestCaseEffort } from '../models/LibraryTestCaseEffort';

@Injectable({
  providedIn: 'root'
})
export class LibraryTestCaseEffortService {
  
  private baseURL = `${environment.gatewayUrl}/qa-service`;

  public constructor(private http: HttpClient) {
  }

  addLibraryTestCaseEffort(libraryTestCaseEffort: LibraryTestCaseEffort): Observable<any> {
    console.log(libraryTestCaseEffort)
    return this.http.post(this.baseURL + '/libraryTestCaseEfforts/addLibraryTestCaseEffort', libraryTestCaseEffort, { responseType: 'text' as 'json' });
  }

  editLibraryTestCaseEffort(id: number, libraryTestCaseEffort: LibraryTestCaseEffort): Observable<any> {
    return this.http.put(this.baseURL + '/libraryTestCaseEfforts/editLibraryTestCaseEffort/' + id, libraryTestCaseEffort, { responseType: 'text' as 'json' });
  }

  getLibraryTestCaseEffortListByLibraryTestCaseId(libraryTestCaseId): Observable<LibraryTestCaseEffort[]> {
    return this.http.get<LibraryTestCaseEffort[]>(this.baseURL + '/libraryTestCaseEfforts/' + libraryTestCaseId);
  }


  getLastInCompletedLibraryTestCaseEffortByTestRunId(libraryTestCaseId): any {
    return this.http.get<LibraryTestCaseEffort>(this.baseURL + '/last-test-effort/' + libraryTestCaseId);
  }

  getTotalEffortByLibraryTestCaseId(libraryTestCaseId): any {
    return this.http.get<any>(this.baseURL + '/libraryTestCaseEfforts/totalLibraryTestCaseByTestCaseLibraryId/' + libraryTestCaseId);
  }
}
