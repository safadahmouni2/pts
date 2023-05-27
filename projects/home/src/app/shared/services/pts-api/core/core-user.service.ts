import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CoreUserModel } from './core.models';

@Injectable({
  providedIn: 'root',
})
export class CoreUserService {

  public currentUser$ = new BehaviorSubject<CoreUserModel>(null);

  public constructor(private http: HttpClient) { }

  getCurrentUser(): Observable<any> {
    return this.http.get<CoreUserModel[]>(
      `${environment.coreUrl}/services/request/getJsonData/1000345`
    );
  }
}
