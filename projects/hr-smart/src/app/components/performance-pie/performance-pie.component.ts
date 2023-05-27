import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
    selector: 'modalPerformance',
    templateUrl: './modalPerformance.html'
})

export class ModalPerformance implements OnInit {
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
            key: 'Efficiency and autonomy',
            y: 5
        },
        {
            key: 'Analytical skills',
            y: 2
        },
        {
            key: 'Communication',
            y: 9
        },
        {
            key: 'Technical skills',
            y: 7
        },
        {
            key: 'Discipline and quality of work',
            y: 4
        },
        {
            key: 'Initiative',
            y: 3
        }
    ];
    ngOnInit() {
    }

}
@Component({
    selector: 'app-performance-pie',
    template: ' <nvd3 [options]="options" [data]="data"></nvd3>',
    //  styleUrls: ['./performance-pie.component.css']
})
export class PerformancePieComponent implements OnInit {
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
            key: 'Efficiency and autonomy',
            y: 5
        },
        {
            key: 'Analytical skills',
            y: 2
        },
        {
            key: 'Communication',
            y: 9
        },
        {
            key: 'Technical skills',
            y: 7
        },
        {
            key: 'Discipline and quality of work',
            y: 4
        },
        {
            key: 'Initiative',
            y: 3
        }
    ];
    ngOnInit() {
    }
    openModalPerformance() {
        const modalRef = this.modalService.open(ModalPerformance);
        modalRef.componentInstance.name = 'bonjour';
        console.log('bnj');
    }
}
