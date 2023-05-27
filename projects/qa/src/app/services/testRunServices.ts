import { Injectable } from '@angular/core';
import { TestRun } from '../models/TestRun';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TestRunDTO } from '../models/TestRunDTO';

@Injectable({
  providedIn: 'root'
})
export class TestRunServices {

  private baseURL = `${environment.gatewayUrl}/qa-service`;
  headers = new HttpHeaders();
  options;
  optionsWithAccept;
  headersWithAcccept = new HttpHeaders({ 'Content-Type': 'application/json' });

  public constructor(private http: HttpClient) {
    this.options = { headers: this.headers };
    this.options = { headers: this.headers };
    this.headersWithAcccept.append('Accept', 'application/json;charset=UTF-8');
    this.optionsWithAccept = { headers: this.headersWithAcccept };
  }

  addTestRun(testRun: TestRunDTO, installedId: number, projectId: number, createTestSuite: boolean): Observable<any> {
    return this.http.post(
      `${this.baseURL}/addTestRun/${installedId}/${projectId}/${createTestSuite}`, testRun, { responseType: 'text' as 'json' });
  }
  getTestRunById(id: number): Observable<TestRun> {
    return this.http.get<TestRun>(this.baseURL + '/testRun' + '/' + id);
  }

  getTestRunByInstall(installedRelease: number): Observable<TestRun[]> {
    return this.http.get<TestRun[]>(this.baseURL + '/testRunsByInstall' + '/' + installedRelease);
  }
  countTestRunsByInstall(installId: number): Observable<number> {
    return this.http.get<number>(`${this.baseURL}/test-runs/count-by-install/${encodeURIComponent(Number(installId))}`);

  }
  getInstallsByEnvId(envId:number){
    return this.http.get<any[]>(this.baseURL + '/testRuns/install' + '/' + envId);
  }

  getTestRunByEnvId(envId:number){
    return this.http.get<any>(this.baseURL + '/testRuns/environment' + '/' + envId);
  }

}
