import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SmartObjectService } from '../../services/SO.service';
@Component({
    selector: 'modalHorizentalBars',
    templateUrl: './modalHorizentalBars.html',
    styleUrls: ['./horizental-bars.component.css']
})

export class ModalHorizentalBars {

    constructor(public activeModal: NgbActiveModal) {
    }


}
@Component({
    selector: 'app-horizental-bars',
    templateUrl: './horizental-bars.component.html',
    styleUrls: ['./horizental-bars.component.css']
})
export class HorizentalBarsComponent implements OnInit {
    listYears3 = [
        { id: 0, name: '2018' },
        { id: 1, name: '2017' },
        { id: 2, name: '2016' },
        { id: 3, name: '2015' },
    ];
    options = {
        chart: {
            type: 'multiBarHorizontalChart',
            height: 450,
            width: 800,
            x: function (d) { return d.label; },
            y: function (d) { return d.value; },
            //yErr: function(d){ return [-Math.abs(d.value * Math.random() * 0.3), Math.abs(d.value * Math.random() * 0.3)] },
            showControls: false,
            showValues: true,
            duration: 500,
            xAxis: {
                showMaxMin: false
            },
            yAxis: {
                axisLabel: 'values',
                tickFormat: function (d) {
                    return d3.format(',.2f')(d);
                }
            },
            stacked: true
        }
    };
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
    data = [
        {
            key: 'DOCU',
            // 'color': '#d62728',
            values: [
                {
                    label: 'PFE',
                    value: this.yPFE
                },
                {
                    label: 'TRAINEE',
                    value: this.yTrainee
                },
                {
                    label: 'TECH',
                    value: this.yTECH
                },
                {
                    label: 'EMP',
                    value: 0
                },
                {
                    label: 'REC',
                    value: 0
                },
                {
                    label: 'P.PFE',
                    value: this.yPPFE
                },
                {
                    label: 'P.TECH',
                    value: this.yPTECH
                },
                {
                    label: 'P.TRN',
                    value: this.yPTRN
                },
                {
                    label: 'RECR',
                    value: 0
                },
                {
                    label: 'TBA',
                    value: 0
                },
                {
                    label: 'PRO',
                    value: this.yPRO
                },
                {
                    label: 'PT',
                    value: 0
                }
            ]
        },
        {
            key: 'TECH',
            //    'color': '#1f77b4',
            values: [
                {
                    label: 'PFE',
                    value: this.yPFE
                },
                {
                    label: 'TRAINEE',
                    value: this.yTrainee
                },
                {
                    label: 'TECH',
                    value: this.yTECH
                },
                {
                    label: 'EMP',
                    value: 0
                },
                {
                    label: 'REC',
                    value: 0
                },
                {
                    label: 'P.PFE',
                    value: this.yPPFE
                },
                {
                    label: 'P.TECH',
                    value: this.yPTECH
                },
                {
                    label: 'P.TRN',
                    value: this.yPTRN
                },
                {
                    label: 'RECR',
                    value: 0
                },
                {
                    label: 'TBA',
                    value: this.yTBA
                },
                {
                    label: 'PRO',
                    value: 0
                },
                {
                    label: 'PT',
                    value: this.yPT
                }
            ]
        }, {
            key: 'SKILL',
            //   'color': '#1f77b4',
            values: [
                {
                    label: 'PFE',
                    value: this.yPFE
                },
                {
                    label: 'TRAINEE',
                    value: this.yTrainee
                },
                {
                    label: 'TECH',
                    value: this.yTECH
                },
                {
                    label: 'EMP',
                    value: this.yEMP
                },
                {
                    label: 'REC',
                    value: 0
                },
                {
                    label: 'P.PFE',
                    value: 0
                },
                {
                    label: 'P.TECH',
                    value: 0
                },
                {
                    label: 'P.TRN',
                    value: this.yPTRN
                },
                {
                    label: 'RECR',
                    value: this.yRECR
                },
                {
                    label: 'TBA',
                    value: 0
                },
                {
                    label: 'PRO',
                    value: this.yPRO
                },
                {
                    label: 'PT',
                    value: this.yPT
                }
            ]
        }, {
            key: 'RESSOURCES',
            //  'color': '#1f77b4',
            values: [
                {
                    label: 'PFE',
                    value: this.yPFE
                },
                {
                    label: 'TRAINEE',
                    value: this.yTrainee
                },
                {
                    label: 'TECH',
                    value: 0
                },
                {
                    label: 'EMP',
                    value: this.yEMP
                },
                {
                    label: 'REC',
                    value: this.yREC
                },
                {
                    label: 'P.PFE',
                    value: 0
                },
                {
                    label: 'P.TECH',
                    value: 0
                },
                {
                    label: 'P.TRN',
                    value: 0
                },
                {
                    label: 'RECR',
                    value: 0
                },
                {
                    label: 'TBA',
                    value: 0
                },
                {
                    label: 'PRO',
                    value: 0
                },
                {
                    label: 'PT',
                    value: 0
                }]
        }, {
            key: 'MOTIVATION',
            //  'color': '#1f77b4',
            values: [
                {
                    label: 'PFE',
                    value: 0
                },
                {
                    label: 'TRAINEE',
                    value: 0
                },
                {
                    label: 'TECH',
                    value: 0
                },
                {
                    label: 'EMP',
                    value: 0
                },
                {
                    label: 'REC',
                    value: 0
                },
                {
                    label: 'P.PFE',
                    value: 0
                },
                {
                    label: 'P.TECH',
                    value: 0
                },
                {
                    label: 'P.TRN',
                    value: 0
                },
                {
                    label: 'RECR',
                    value: 0
                },
                {
                    label: 'TBA',
                    value: this.yTBA
                },
                {
                    label: 'PRO',
                    value: 0
                },
                {
                    label: 'PT',
                    value: 0
                }]
        }, {
            key: 'TEAM BUILDING',
            //  'color': '#1f77b4',
            values: [
                {
                    label: 'PFE',
                    value: 0
                },
                {
                    label: 'TRAINEE',
                    value: 0
                },
                {
                    label: 'TECH',
                    value: this.yTECH
                },
                {
                    label: 'EMP',
                    value: this.yEMP
                },
                {
                    label: 'REC',
                    value: 0
                },
                {
                    label: 'P.PFE',
                    value: 0
                },
                {
                    label: 'P.TECH',
                    value: 0
                },
                {
                    label: 'P.TRN',
                    value: 0
                },
                {
                    label: 'RECR',
                    value: 0
                },
                {
                    label: 'TBA',
                    value: this.yTBA
                },
                {
                    label: 'PRO',
                    value: this.yPRO
                },
                {
                    label: 'PT',
                    value: this.yPT
                }]
        }, {
            key: 'TEAM LEADERSHIP',
            //  'color': '#1f77b4',
            values: [
                {
                    label: 'PFE',
                    value: this.yPFE
                },
                {
                    label: 'TRAINEE',
                    value: this.yTrainee
                },
                {
                    label: 'TECH',
                    value: this.yTECH
                },
                {
                    label: 'EMP',
                    value: this.yEMP
                },
                {
                    label: 'REC',
                    value: 0
                },
                {
                    label: 'P.PFE',
                    value: 0
                },
                {
                    label: 'P.TECH',
                    value: 0
                },
                {
                    label: 'P.TRN',
                    value: 0
                },
                {
                    label: 'RECR',
                    value: this.yRECR
                },
                {
                    label: 'TBA',
                    value: this.yTBA
                },
                {
                    label: 'PRO',
                    value: this.yPRO
                },
                {
                    label: 'PT',
                    value: 0
                }]
        }, {
            key: 'CRISIS MANAGEMENT',
            //  'color': '#1f77b4',
            values: [
                {
                    label: 'PFE',
                    value: 0
                },
                {
                    label: 'TRAINEE',
                    value: 0
                },
                {
                    label: 'TECH',
                    value: 0
                },
                {
                    label: 'EMP',
                    value: 0
                },
                {
                    label: 'REC',
                    value: 0
                },
                {
                    label: 'P.PFE',
                    value: 0
                },
                {
                    label: 'P.TECH',
                    value: 0
                },
                {
                    label: 'P.TRN',
                    value: 0
                },
                {
                    label: 'RECR',
                    value: 0
                },
                {
                    label: 'TBA',
                    value: 0
                },
                {
                    label: 'PRO',
                    value: this.yPRO
                },
                {
                    label: 'PT',
                    value: 0
                }]
        }, {
            key: 'IMPROVEMENT INTERNAL PROCESS',
            //   'color': '#1f77b4',
            values: [
                {
                    label: 'PFE',
                    value: 0
                },
                {
                    label: 'TRAINEE',
                    value: 0
                },
                {
                    label: 'TECH',
                    value: this.yTECH
                },
                {
                    label: 'EMP',
                    value: this.yEMP
                },
                {
                    label: 'REC',
                    value: 0
                },
                {
                    label: 'P.PFE',
                    value: 0
                },
                {
                    label: 'P.TECH',
                    value: 0
                },
                {
                    label: 'P.TRN',
                    value: 0
                },
                {
                    label: 'RECR',
                    value: 0
                },
                {
                    label: 'TBA',
                    value: this.yTBA
                },
                {
                    label: 'PRO',
                    value: this.yPRO
                },
                {
                    label: 'PT',
                    value: 0
                }]
        }

    ]

    constructor(private modalService: NgbModal, private soservice: SmartObjectService) { }

    ngOnInit() {
    }
    openModalHorizentalBars() {
        const modalRef = this.modalService.open(ModalHorizentalBars);
        modalRef.componentInstance.name = 'bonjour';
    }
    compareId3(idFist, idSecond) {
        return idFist && idSecond && idFist.id === idSecond.id;
    }
}
