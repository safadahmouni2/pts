import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TestStep } from '../models/TestStep';

@Injectable({
    providedIn: 'root'
})
export class TestStepChangesService {

    private baseURL = `${environment.gatewayUrl}/qa-service`;

    public constructor(private http: HttpClient) {
    }

    addTestStepChanges(testStepChanges: TestStep): Observable<any> {
        return this.http.post(this.baseURL + '/test-step-changes', testStepChanges, { responseType: 'text' as 'json' });
    }

    updateTestStepChanges(testStepChanges: TestStep): Observable<any> {
        return this.http.put(this.baseURL + '/test-step-changes/' + testStepChanges.id, testStepChanges, { responseType: 'text' as 'json' });
    }

    deleteTestStepChanges(id: number,): Observable<any> {
        return this.http.delete(this.baseURL + '/test-step-changes/' + id);
    }


}
