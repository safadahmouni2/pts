import { Component, OnInit, Injectable, ViewChild, TemplateRef } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ServicesComponent } from '../services/services.component';
import { SO } from '../services/SO';
import { SmartActionType } from '../services/SmartActionType';
import { DefaultService, SmartObjectEntry, TrainingEntry, UserEntry } from '../../webservice/generated/hr-smart-service';
@Component({
  selector: 'app-manage-propositions',
  templateUrl: './manage-propositions.component.html',
  styleUrls: ['./manage-propositions.component.css']
})
@Injectable()
export class ManagePropositionsComponent implements OnInit {
  public collapsed = false;
  public smartobject: any;
  public smartactiontype: SmartActionType[] = [];
  public currentSO: SO;
  public sat;
  public smart;
  public points;
  allUser: any;
  searchtype: any;
  searchresponsable: any;
  searchurgency: any;
  searchdecision: any;
  SOpoints: number;
  modalRef: any;
  filterDecision = new Array<any>();
  filterUrgency = new Array<any>();
  filterName = new Array<any>();
  freeSearch: any;
  @ViewChild('acceptProposition', { static: true }) acceptProposition: TemplateRef<any>;
  @ViewChild('rejectProposition', { static: true }) rejectProposition: TemplateRef<any>;
  constructor(private modalService: NgbModal,
    private defaultService: DefaultService,
    public activeModal: NgbActiveModal) {

  }
  ngOnInit() {
    this.getSmartObject();
    this.getUsers();
  }

  /****************************************/
  /*            public  Methods           */
  /****************************************/
  public collapse() {
    this.collapsed = !this.collapsed;
  }
  public open(smart: SO) {
    this.modalRef = this.modalService.open(this.acceptProposition);
    this.modalRef.result.then((result) => {
      const closeResult = `Closed with: ${result}`;
    }, (reason) => {
    });
    this.getPoints(smart);
  }
  public updateSmartObject(proposition, soStatus) {
    this.modalRef.close();
    let soPoint = 0;
    if (soStatus === 'Accepted') {
      soPoint = this.SOpoints;
    }
    const rest: SmartObjectEntry = {
      id: proposition.id,
      creator: proposition.creator,
      type: proposition.type,
      points: soPoint,
      name: proposition.name,
      subject: proposition.subject,
      departement: proposition.departement,
      date: proposition.date,
      hours: proposition.Hours,
      description: proposition.description,
      status: soStatus,
      urgency: proposition.urgency,
      createdAt: proposition.createdAt,
      updatedAt: proposition.updatedAt,
    };
    this.defaultService.updateSmartObject(rest).subscribe((so) => {
      if (soStatus === 'Accepted') {
        this.addTraining(proposition);
      }
      this.getSmartObject();
    });
  }
  public open2() {
    this.modalRef = this.modalService.open(this.rejectProposition);
  }

  public openSO(so) {
    const modalRef = this.modalService.open(ServicesComponent);
    modalRef.componentInstance.name = so;
  }
  public onSearch(value) {
    this.freeSearch = value ;
  }
  /****************************************/
  /*            private  Methods           */
  /****************************************/
  private getUsers() {
    this.defaultService.getUsers().subscribe((data) => {
      this.allUser = data;
    });
  }
  private getSmartObject() {
    this.defaultService.getSmartObjects().subscribe((data) => {
      this.smartobject = data
        .filter(proposition => {
          return (proposition.type !== 'pt' && proposition.type !== 'tech');
        });

      // get distinct smart object
      this.filterDecision = Array.from(new Set(this.smartobject.map(s => s.status))).map(y => {
        return { status: y };
      });
      this.filterUrgency = Array.from(new Set(this.smartobject.map(s => s.urgency))).map(y => {
        return { urgency: y };
      });
      this.filterName = Array.from(new Set(this.smartobject.map(s => s.name))).map(y => {
        return { name: y };
      });
    });
  }
  private getPoints(prop) {
    this.defaultService.getSmartActionType(prop.type).subscribe((data) => {
      this.SOpoints = data[0].points;
    });
  }

  private addTraining(proposition) {
    const trainingModerator: UserEntry = {
      code: proposition.moderator,
    };
    let trainingStatus;
    if (proposition.moderator != null && proposition.moderator !== '') {
      trainingStatus = 'Planned';
    } else {
      trainingStatus = 'Proposed';
    }
    const training: TrainingEntry = {
      id: proposition.id,
      moderator: trainingModerator,
      topic: proposition.type,
      subject: proposition.subject,
      departement: proposition.departement,
      date: proposition.date,
      hours: proposition.hours,
      description: proposition.description,
      status: trainingStatus,
      urgency: proposition.urgency,
    };
    this.defaultService.addTraining(training).subscribe((so) => {
    });
  }

}


