import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SO } from '../components/services/SO';
import { SmartObjects } from '../components/services/mock-so';
import { UserLoggedService } from './user-logged.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class SmartObjectService {
  soFiltred: SO[] = [];
  so: SO[] = [];
  points;
  constructor(private userlog: UserLoggedService, private users: UserService) { }
  getSmartObjects(): Observable<SO[]> {
    return of(SmartObjects);
  }
  getSO() {
    this.getSmartObjects().subscribe(so => this.so = so);
    return this.so;
  }
  getSOFiltred() {
    this.soFiltred = this.getSO().filter(item => item.creator === this.userlog.getUserLogged());
    return this.soFiltred;
  }
  getSOByCreator(creator) {
    this.soFiltred = this.getSO().filter(item => item.creator === creator);
    return this.soFiltred;
  }
  getPointsSOFiltred() {
    let points = 0;
    this.getSOFiltred().forEach(item => { points = points + item.points; });
    return points;
  }
  getPointsSOByCreator(creator) {
    let points = 0;
    this.getSOByCreator(creator).forEach(item => { points = points + item.points; });
    return points;
  }
  getSOByType(typeso) {
    let so: SO[] = [];
    so = this.getSOFiltred().filter(item => item.type === typeso);
    return so;
  }
  getPointsSOByType(typeso) {
    let points = 0;
    this.getSOByType(typeso).forEach(item => { points = points + item.points; });
    return points;
  }
  getPointsToReach(typeso) {
    let so: SO[] = [];
    let points = 0;
    let usernumber = 0;
    so = this.getSO().filter(item => item.type === typeso);
    so.forEach(item => { points = points + item.points; });
    usernumber = this.users.getUsersLength();
    return (points / usernumber);

  }

}
