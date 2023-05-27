import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'modalRadar',
  templateUrl: './modalRadar.html',
})

export class ModalRadar {

  constructor(public activeModal: NgbActiveModal) {
  }

}
@Component({
  selector: 'app-radar',
  templateUrl: './radar.component.html',
  // styleUrls: ['src/assets/css/styles.css']
})
export class RadarComponent implements OnInit {

  public radarChartLabels = ['Ajax', 'Angular 4', 'Ant', 'APEX', 'Bootstrap 4', 'Cordova 7.0', 'D3',
    'DB2', 'Eclipselink', 'EJB', 'Hibernate'];
  public radarChartData = [
    {
      data: [2, 3, 4, 3, 3, 2, 3, 4, 2, 3, 2], label: '2018',
      options: { scale: { ticks: { beginAtZero: true, min: 0, max: 5, stepSize: 1 } } }
    }];
  public radarChartType = 'radar';

  openModalRadar() {
    const modalRef = this.modalService.open(ModalRadar);
    modalRef.componentInstance.name = 'bonjour';
  }
  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }

}
