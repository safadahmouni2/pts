import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { SourceSystem } from "../models/SourceSystem";

@Injectable({
  providedIn: 'root'
})
export class SourceSystemService {

  private sourceSystemUrl = '/source-systems';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  private baseURL = `${environment.gatewayUrl}/qa-service`;

  constructor(private httpClient: HttpClient) {
  }

  getAllSourceSystems(): Observable<SourceSystem[]> {
    return this.httpClient.get<SourceSystem[]>(this.baseURL + this.sourceSystemUrl);
  }

  createSourceSystem(sourceSystem: SourceSystem): Observable<SourceSystem> {
    return this.httpClient.post(this.baseURL + this.sourceSystemUrl, sourceSystem);
  }

  getSourceSystemByName(SourceSystemName): Observable<any> {
    return this.httpClient.get(this.baseURL + this.sourceSystemUrl + '/' + SourceSystemName);
  }

}
