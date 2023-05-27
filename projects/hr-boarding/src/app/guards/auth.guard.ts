import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {

  public isLogged: boolean;
  public mydata: any;
  constructor(private router: Router, public authenticationService: AuthenticationService, public http: HttpClient) {
  }


  canActivate(): Observable<boolean> {
    return this.authenticationService.isLogged();
  }




}
