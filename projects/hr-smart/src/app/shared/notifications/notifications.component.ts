import { Component, OnInit} from '@angular/core';
import { Notification } from '../../components/services/Notification';
import { UserLoggedService } from '../../services/user-logged.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  public user;
  constructor( private notification: NotificationService, private userlog: UserLoggedService) { }
  getUserLogged() {
    return this.userlog.getUserLogged();
  }
  ngOnInit() {
    this.notification.getNotifications().subscribe(data => {
      this.notifications = data;
    });
    this.user = this.userlog.getUserLogged();
  }
}
