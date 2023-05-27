import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Notification } from '../components/services/Notification';
import { NOTIFICATIONS } from '../components/services/mock-notifications';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) { }
  getNotifications(): Observable<Notification[]> {
     return this.http.get('http://192.168.0.78:8085/services/request/getJsonData/1000527')
                   .pipe(map(data => data as Array<Notification>));

 //   return of(NOTIFICATIONS);
  }
  getNotificationLength() {
    return NOTIFICATIONS.length;
  }
  addNotification(notif) {
    NOTIFICATIONS.push(notif);
  }
}
