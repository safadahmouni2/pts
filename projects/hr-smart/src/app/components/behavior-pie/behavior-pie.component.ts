import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-behavior-pie',
  template: ' <nvd3 [options]="options" [data]="data"></nvd3>',
  styleUrls: ['./behavior-pie.component.css']
})
export class BehaviorPieComponent implements OnInit {

  constructor(private modalService: NgbModal) { }


  options = {
    chart: {
      type: 'pieChart',
      height: 300,
      margin: {
        top: 0,
        right: 20,
        bottom: 0,
        left: 20
      },
      // color: ['#97bbcd', '#dcdcdc'],
      x: function (d) { return d.key; },
      y: function (d) { return d.y; },
      labelType: 'value',
      /* legend: {
           updateState:false
       },*/
      showLabels: true,
      showLegend: true,
      transitionDuration: 500,
      labelThreshold: 0.01,
      labelSunbeamLayout: true
    }
  };

  data = [
    {
      key: 'Cooperation and teamWork',
      y: 5
    },
    {
      key: 'Availibility',
      y: 2
    },
    {
      key: 'Punctuality and regular attendance',
      y: 9
    },
    {
      key: 'Self-control and stress-tolerance',
      y: 7
    },
    {
      key: 'Collaboration with the hiearchy',
      y: 4
    }
  ];
  ngOnInit() {
  }

  openModalBehavior() {
    const modalRef = this.modalService.open(ModalBehavior);
    modalRef.componentInstance.name = 'bonjour';
    console.log('bnj');
  }
}

@Component({
  selector: 'modalBehavior',
  templateUrl: './modalBehavior.html'
})

export class ModalBehavior implements OnInit {
  constructor(public activeModal: NgbActiveModal) {
  }
  options = {
    chart: {
      type: 'pieChart',
      height: 400,
      // color: ['#97bbcd', '#dcdcdc'],
      x: function (d) { return d.key; },
      y: function (d) { return d.y; },
      labelType: 'value',
      showLabels: true,
    },
    transitionDuration: 500,
    labelThreshold: 0.01,
    labelSunbeamLayout: true,
  };
  data = [
    {
      key: 'Cooperation and teamWork',
      y: 5
    },
    {
      key: 'Availibility',
      y: 2
    },
    {
      key: 'Punctuality and regular attendance',
      y: 9
    },
    {
      key: 'Self-control and stress-tolerance',
      y: 7
    },
    {
      key: 'Collaboration with the hiearchy',
      y: 4
    }
  ];
  ngOnInit() {
  }
}
