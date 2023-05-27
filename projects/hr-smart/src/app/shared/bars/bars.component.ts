import { Component, OnInit, NgModule } from '@angular/core';
// import { NvD3Component } from 'ng2-nvd3';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SmartObjectService } from '../../services/SO.service';
import * as d3 from 'd3';
@Component({
  selector: 'modalBars',
  templateUrl: './modalBars.html',
  styleUrls: ['./bars.component.css']
})

export class ModalBars {

  constructor(public activeModal: NgbActiveModal) {
  }

}
@Component({
  selector: 'app-bars',
  templateUrl: './bars.component.html',
  styleUrls: ['./bars.component.css']
  // encapsulation: ViewEncapsulation.None
})
// @NgModule({
// declarations: [NvD3Component]})


export class BarsComponent implements OnInit {
  constructor(private modalService: NgbModal, private http: Http, private soservice: SmartObjectService) {

  }
  yPFE = this.soservice.getPointsSOByType('p.pfe');
  yTrainee = this.soservice.getPointsSOByType('trainee');
  yTECH = this.soservice.getPointsSOByType('tech');
  yEMP = this.soservice.getPointsSOByType('emp');
  yREC = this.soservice.getPointsSOByType('rec');
  yPPFE = this.soservice.getPointsSOByType('p.pfe');
  yPTRN = this.soservice.getPointsSOByType('p.trn');
  yPTECH = this.soservice.getPointsSOByType('p.tech');
  yTBA = this.soservice.getPointsSOByType('tba');
  yPRO = this.soservice.getPointsSOByType('pro');
  yPT = this.soservice.getPointsSOByType('pt');
  yRECR = this.soservice.getPointsSOByType('recr');

  yPFE1 = this.soservice.getPointsToReach('p.pfe');
  yTrainee1 = this.soservice.getPointsToReach('trainee');
  yTECH1 = this.soservice.getPointsToReach('tech');
  yEMP1 = this.soservice.getPointsToReach('emp');
  yREC1 = this.soservice.getPointsToReach('rec');
  yPPFE1 = this.soservice.getPointsToReach('p.pfe');
  yPTRN1 = this.soservice.getPointsToReach('p.trn');
  yPTECH1 = this.soservice.getPointsToReach('p.tech');
  yTBA1 = this.soservice.getPointsToReach('tba');
  yPRO1 = this.soservice.getPointsToReach('pro');
  yPT1 = this.soservice.getPointsToReach('pt');
  yRECR1 = this.soservice.getPointsToReach('recr');

  listYears2 = [
    { id: 0, name: '2018' },
    { id: 1, name: '2017' },
    { id: 2, name: '2016' },
    { id: 3, name: '2015' },
  ];


  options = {
    chart: {
      type: 'multiBarChart',
      height: 300,
      margin: {
        top: 50,
        right: 20,
        bottom: 60,
        left: 45
      },
      clipEdge: true,
      staggerLabels: false,
      transitionDuration: 500,
      stacked: true,
      groupSpacing: 0.3,
      yAxis: {
        axisLabel: 'points',
        axisLabelDistance: 0,
        orient: 'left',
        width: 33,
        height: 100,
        showMaxMin: true,
        highlightZero: false,
        rotateYLabel: false,
        rotateLabels: 0,
        staggerLabels: false
      },
      xAxis: {
        showMaxMin: false,
        rotateLabels: -45,
        staggerLabels: false,
        axisLabelDistance: 0
      },
      width: 800,
      showControls: true,
      showLegend: true,
      showXAxis: true,
      showYAxis: true,
      noData: 'No Data Available.',
      reduceXTicks: false,

    }
  };
  data = [{
    key: 'Obtained',
    values: [{
      x: 'PFE',
      y: this.yPFE
    },
    {
      x: 'TRAINEE',
      y: this.yTrainee
    }, {
      x: 'TECH',
      y: this.yTECH
    },
    {
      x: 'EMP',
      y: this.yEMP
    },
    {
      x: 'REC',
      y: this.yREC
    }, {
      x: 'P.PFE',
      y: this.yPPFE
    },
    {
      x: 'P.TRN',
      y: this.yPTRN
    },
    {
      x: 'P.TECH',
      y: this.yPTECH
    }, {
      x: 'RECR',
      y: this.yRECR
    },
    {
      x: 'TBA',
      y: this.yTBA
    },
    {
      x: 'PRO',
      y: this.yPRO
    }, {
      x: 'PT',
      y: this.yPT
    }]


  },
  {
    key: 'to reach',
    values: [{
      x: 'PFE',
      y: this.yPFE1
    },
    {
      x: 'TRAINEE',
      y: this.yTrainee1
    }, {
      x: 'TECH',
      y: this.yTECH1
    },
    {
      x: 'EMP',
      y: this.yEMP1
    },
    {
      x: 'REC',
      y: this.yREC1
    }, {
      x: 'P.PFE',
      y: this.yPPFE1
    },
    {
      x: 'P.TRN',
      y: this.yPTRN1
    },
    {
      x: 'P.TECH',
      y: this.yPTECH1
    }, {
      x: 'RECR',
      y: this.yRECR1
    },
    {
      x: 'TBA',
      y: this.yTBA1
    },
    {
      x: 'PRO',
      y: this.yPRO1
    }, {
      x: 'PT',
      y: this.yPT1
    }]

  }];

  ngOnInit() {

  }

  compareId2(idFist, idSecond) {
    return idFist && idSecond && idFist.id === idSecond.id;
  }
  openModalBars() {
    const modalRef = this.modalService.open(ModalBars);
    modalRef.componentInstance.name = 'bonjour';
  }

}



