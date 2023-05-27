
import { Injectable } from '@angular/core';
import { Environment } from '../models/Environment';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentServices {
  private baseURL = environment.coreUrl;
  public constructor(private http: HttpClient) {
  }

  getEnvironmentByProduct(param1: string) {
    return this.http.get<Environment[]>(this.baseURL + '/services/request/getJsonData/1000572?param1=' + param1);
  }

}
