import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserLoggedService } from '../../services/user-logged.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  providers: [AuthService]

})
export class MenuComponent implements OnInit {
  userData;
  collapsed = false;
  serverpath: string = 'https://pts.thinktank.de';
  currentUserPict: string;
  allUser: any;
  currentUser: any;
  trainingsDisplayed = false;


  constructor(
    public http: HttpClient,
    private route: ActivatedRoute,
    public router: Router) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('currentUser'));
    this.currentUserPict = this.userData.avatar;
    this.route.params.subscribe(routeParams => {
      if (routeParams.status) {
        this.trainingsDisplayed = true;
      }
    });

  }
  displayTrainings() {
    this.trainingsDisplayed = !this.trainingsDisplayed;
  }

}
