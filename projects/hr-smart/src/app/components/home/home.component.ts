import { Component, OnInit } from '@angular/core';
import { RadarComponent } from '../radar/radar.component';
import { PerformancePieComponent } from '../performance-pie/performance-pie.component';
import { BehaviorPieComponent } from '../behavior-pie/behavior-pie.component';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DefaultService, UserEntry } from '../../webservice/generated/hr-smart-service';
import { BarsComponent } from '../../shared/bars/bars.component';
import { HorizentalBarsComponent } from '../../shared/horizental-bars/horizental-bars.component';
import { RatingComponent } from '../../shared/rating/rating.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public indiceMenu = 6;
  isOpen1 = true;
  isOpen2 = true;
  isOpen3 = true;
  isOpen4 = true;
  isOpen5 = true;
  isOpen6 = true;
  isOpen7 = true;
  isOpen8 = true;
  isDisabled1 = true;
  isDisabled2 = true;
  isDisabled3 = true;
  isDisabled4 = true;
  isDisabled5 = true;
  isDisabled6 = true;
  isDisabled7 = true;
  isDisabled8 = true;
  allUser: any
  currentUser: any;
  public collapsed = false;
  userData;
  stockedInSession = false;
  public collapse() {
    this.collapsed = !this.collapsed;
  }
  open1() {
    this.isDisabled1 = false;
    this.isOpen1 = !this.isOpen1;
    this.isDisabled1 = true;
  }
  open2() {
    this.isDisabled2 = false;
    this.isOpen2 = !this.isOpen2;
    this.isDisabled2 = true;
  }
  open3() {
    this.isDisabled3 = false;
    this.isOpen3 = !this.isOpen3;
    this.isDisabled3 = true;
  }
  open4() {
    this.isDisabled4 = false;
    this.isOpen4 = !this.isOpen4;
    this.isDisabled4 = true;
  }
  open5() {
    this.isDisabled5 = false;
    this.isOpen5 = !this.isOpen5;
    this.isDisabled5 = true;
  }
  open6() {
    this.isDisabled6 = false;
    this.isOpen6 = !this.isOpen6;
    this.isDisabled6 = true;
  }
  open7() {
    this.isDisabled7 = false;
    this.isOpen7 = !this.isOpen7;
    this.isDisabled7 = true;
  }
  open8() {
    this.isDisabled8 = false;
    this.isOpen8 = !this.isOpen8;
    this.isDisabled8 = true;
  }
  openBars() {
    this.bars.openModalBars();
  }
  openHorizentalBars() {
    this.horizentalBars.openModalHorizentalBars();
  }
  openRadar() {
    this.radar.openModalRadar();
  }
  openPie() {
    this.pie.openModalPerformance();
  }
  openPie2() {
    this.pie2.openModalBehavior();
  }
  openRating() {
    this.rating.openModalRating();
  }
  constructor(
    private bars: BarsComponent,
    private horizentalBars: HorizentalBarsComponent,
    private radar: RadarComponent,
    private pie: PerformancePieComponent,
    private rating: RatingComponent,
    private pie2: BehaviorPieComponent, public http: HttpClient,
    private defaultService: DefaultService) { }

  ngOnInit() {
    this.getCurrentUser().subscribe((PTSuser) => {
      this.getUsers(PTSuser);
    });

  }
  public onSearch(event) {

  }
  public getUsers(PTSuser) {
    this.defaultService.getUsers().subscribe((data) => {
      console.log(data);
      this.allUser = data;
      this.currentUser = this.allUser
        .filter(user => {
          return user.code === PTSuser[0].user_code;
        });
      if (this.currentUser.length === 0 || !this.currentUser) {
        this.addUser(PTSuser);
      } else {
        sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser[0]));
        this.stockedInSession = true;
      }
    });
  }
  getCurrentUser(): Observable<any> {
    return this.http.get<any>(`http://192.168.0.78:8085/services/request/getJsonData/1000345`);
  }

  addUser(PTSuser) {
    const user: UserEntry = {
      code: PTSuser[0].user_code,
      roleID: 'employee',
      avatar: PTSuser[0].photo
    };
    this.defaultService.addUser(user).subscribe((so) => {
      sessionStorage.setItem('currentUser', JSON.stringify(user));
      this.stockedInSession = true;
    });
  }
}
