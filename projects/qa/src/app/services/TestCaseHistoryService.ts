import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TestCaseHistoryService {

    private baseURL = `${environment.gatewayUrl}/qa-service`;

    headers = new HttpHeaders();
    options;
    optionsWithAccept;
    headersWithAcccept = new HttpHeaders({ 'Content-Type': 'application/json' });



    constructor(private http: HttpClient) {
        this.options = { headers: this.headers };
        this.options = { headers: this.headers };
        this.headersWithAcccept.append('Accept', 'application/json;charset=UTF-8');
        this.optionsWithAccept = { headers: this.headersWithAcccept };

    }

    getTestCaseHistoryListByTestCaseId(testCaseId: number): Observable<any> {
        return this.http.get<any>(this.baseURL + '/testCaseLibraryHistory?testCaseId=' + testCaseId);

    }
}
