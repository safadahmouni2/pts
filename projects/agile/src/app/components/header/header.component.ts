import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SocketioService } from '../../services/index';
import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/index';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  serverpath: string = 'https://pts.thinktank.de';
  currentUserPict: string;

  constructor(private userService: UserService,
    private authenticationService: AuthenticationService,
    private socketservice: SocketioService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(dataSource => {
      for (const data of dataSource) {
        this.currentUserPict = data.photo;
      }
    });

  }
  logout() {
    const curuser = JSON.stringify(JSON.parse(sessionStorage.currentUser).usercode);
    this.socketservice.deleteUser(curuser);
    this.authenticationService.logout().subscribe(data => { });
  }

}
