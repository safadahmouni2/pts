import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public constructor(private http: HttpClient) { }

  getUser(): Observable<any> {
    return this.http.get<any>(
      environment.coreUrl + '/services/request/getJsonData/1000345'
    );
  }
}
