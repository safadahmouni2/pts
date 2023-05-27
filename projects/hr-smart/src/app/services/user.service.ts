import { Injectable } from '@angular/core';
import { User } from '../components/services/user';
import { USERS } from '../components/services/mock-users';
import { Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  users: User[] = [];
  constructor() { }
  geTUsers(): Observable<User[]> {
    return of(USERS);
  }
  getUsersLength() {
    return USERS.length;
  }
  getUserByAvatar(avatar) {
    this.geTUsers().subscribe(user => this.users = user);
    return this.users.find(user => user.avatar === avatar);
  }
  getUserById(id)
  {
    this.geTUsers().subscribe(user => this.users = user);
    return this.users.find(user => user.id === id);
  }

}
