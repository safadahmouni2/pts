import { Injectable } from '@angular/core';
import { Problem } from '../models/Problem';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProblemServices {
  
  private baseURL = `${environment.gatewayUrl}/qa-service`;

  public constructor(private http: HttpClient) {
  }

  addProblem(problem: Problem): Observable<any> {
    return this.http.post(this.baseURL + '/problems', problem, { responseType: 'text' as 'json' });
  }
  getAllProblemByTestId(testId): Observable<Problem[]> {
    return this.http.get<Problem[]>(this.baseURL + '/problems?test=' + testId);
  }

}
