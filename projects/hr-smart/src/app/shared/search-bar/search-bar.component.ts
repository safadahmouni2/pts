import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserLoggedService } from '../../services/user-logged.service';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../components/services/Notification';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DefaultService } from '../../webservice/generated/hr-smart-service';
import { PropositionsComponent } from '../../components/propositions/propositions.component';
import { HomeComponent } from '../../components/home/home.component';
import { MypropositionComponent } from '../../components/myproposition/myproposition.component';
import { ManagePropositionsComponent } from '../../components/manage-propositions/manage-propositions.component';
@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
  providers: [AuthService]
})
export class SearchBarComponent implements OnInit {
  @Output() freeSearch = new EventEmitter<string>();
  public user;
  public notificationsLength;
  userData: any;
  serverpath = 'https://pts.thinktank.de';
  currentUserPict: string;
  allUser: any;
  currentUser: any;
  search: any;
  constructor(
    private home: HomeComponent,
    private prop: PropositionsComponent,
    private myprop: MypropositionComponent,
    private manprop: ManagePropositionsComponent,
    private authService: AuthService,
    private userlog: UserLoggedService,
    private notification: NotificationService,
    private modalService: NgbModal) {
    this.userData = JSON.parse(sessionStorage.getItem('currentUser'));
  }
  getUserLogged() {
    return this.userlog.getUserLogged();
  }
  collapse2() {
    this.home.collapse();
    this.prop.collapse();
    this.myprop.collapse();
    this.manprop.collapse();
  }
  getLogin() {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    //  return this.authService.getUser().login;
  }
  onSearch(value) {
    this.freeSearch.emit(value) ;
  }
  logout() {
    console.log('Tentative de déconnexion');
    return this.authService.logout();
  }
  open() {
    const modalRef = this.modalService.open(ModalNotificationComponent);
  }
  hasAnyRole(roles: string[]) {
    return this.authService.hasAnyRole(roles);
  }
  ngOnInit() {
    this.notificationsLength = this.notification.getNotificationLength();
  }
}

/****************************************************************************************************
 * **************************************************************************************************
 * **************************************************************************************************
 */

@Component({
  selector: 'modalNotification',
  templateUrl: './modalNotification.html',
  styleUrls: ['./search-bar.component.css'],
  providers: [AuthService]
})
export class ModalNotificationComponent implements OnInit {
  public notif = new Notification();
  constructor(public activeModal: NgbActiveModal, private notification: NotificationService) { }
  ngOnInit() { }
  public onSubmit(notif) {
    this.notification.addNotification(notif);
  }
}
