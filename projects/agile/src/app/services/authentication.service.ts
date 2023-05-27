import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { BaseService } from './base.service';

@Injectable()
export class AuthenticationService extends BaseService {
  public token: string;

  constructor(public http: HttpClient) {
    super(http);
    // set token if saved in local storage
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
  }

  isLogged(): Observable<boolean> {
    return this.httpGet('/request/getJsonData/1000345').pipe(take(1),
      map(user => {
        if (user && user[0]) {
          sessionStorage.setItem('currentUser', JSON.stringify({
            company: user[0].company,
            usercode: user[0].user_code,
            id: user[0].user_id
          }));
          return true;
        } else {
          console.log('%c>>>> User Not Logged', 'color:red;font-size:12px');
          return false;
        }
      }));
  }

  logout(): Observable<any> {
    // clear token remove user from local storage to log user out
    this.token = null;
    sessionStorage.removeItem('currentUser');
    return this.callServiceMethodGet('/request/getJsonData/1000351');
  }
}
