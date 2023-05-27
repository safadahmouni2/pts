import { Injectable } from '@angular/core';
import { Install } from '../models/Install';
import { DropDownPlanRelease } from '../models/DropDownPlanRelease';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { DropDownTestRelease } from '../models/DropDownTestRelease';
import { InstallDataEnv } from '../models/install-data-env';

@Injectable({
  providedIn: 'root'
})
export class InstallServices {

  private baseURL = `${environment.gatewayUrl}/qa-service`;

  public constructor(private http: HttpClient) {
  }

  addInstall(install: Install): Observable<any> {
    return this.http.post(this.baseURL + '/installs', install, { responseType: 'text' as 'json' });
  }

  updateInstall(install: Install): Observable<any> {
    return this.http.put(this.baseURL + '/installs/' + install.installId, install, { responseType: 'text' as 'json' });
  }

  getTestRelease(page: number, rows: number, param1: string): Observable<any> {
    return this.http.get<DropDownPlanRelease>(
      environment.coreUrl + '/services/request/getJson/69?sidx=&page=' + page + '&sord=&rows=' + rows + '&searchTerm=&param1=' + param1);
  }
  getPlanRelease(page: number, rows: number, param1: string): Observable<any> {
    return this.http.get<DropDownTestRelease>(
      environment.coreUrl + '/services/request/getJson/70?sidx=&page=' + page + '&sord=&rows=' + rows + '&searchTerm=&param1=' + param1);
  }
  getInstallFromPTS(productName: string, EnvironmentName: string): Observable<Install> {
    return this.http.get<Install>
      (environment.coreUrl + '/services/request/getJsonData/10000567?param1=' + productName + '&param2=' + EnvironmentName);
  }
  getInstallFromPTS_QA(productId: number, EnvironmentId: number): Observable<Install> {
    return this.http.get<Install>(this.baseURL + '/installs?productId=' + productId + '&envId=' + EnvironmentId);

  }

  getInstallsByEnvIdFromPTS(envId: number): Observable<Array<InstallDataEnv>> {
    return this.http.get<Array<InstallDataEnv>>
      (`${environment.coreUrl}/services/request/getJsonData/1000584?param1=${envId}`);
  }
}
