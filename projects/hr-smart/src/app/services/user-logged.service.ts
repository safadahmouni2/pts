import { Injectable } from '@angular/core';
import { User } from '../components/services/user';
@Injectable({
  providedIn: 'root'
})
export class UserLoggedService {
  public userLogged: User;
  constructor() { }

  public getUserLogged() {
    return this.userLogged;
  }
  public setUserLogged(user) {
    this.userLogged = user;
  }
}
