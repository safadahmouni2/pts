import { Injectable } from '@angular/core';
import {  CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { UserService, AuthenticationService } from '../services/index';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {

  public isLogged: boolean;
  public mydata: any;
  constructor(
    public authenticationService: AuthenticationService) {
  }


  canActivate(next: ActivatedRouteSnapshot): Observable<boolean> {
    const ptsSSOIdParam = 'PTSSSOID';
    const hasPtsSSOIdParam = next.queryParamMap?.has(ptsSSOIdParam);
    if (hasPtsSSOIdParam) {
      localStorage.setItem('PTSSSOID', next.queryParamMap.get(ptsSSOIdParam));
    }
    return this.authenticationService.isLogged();
  }




}
