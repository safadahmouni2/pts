import { Component, OnInit, Input, Injectable } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { setTheme } from 'ngx-bootstrap/utils';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Training } from '../services/Training';
import { SO } from '../services/SO';
import { SmartActionType } from '../services/SmartActionType';
import { SmartActionTypeService } from '../../services/smart-action-type.service';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../services/Notification';
import { DatePipe } from '@angular/common';
import { DefaultService, DepartementEnum, SmartObjectEntry } from '../../webservice/generated/hr-smart-service';
@Component({
  selector: 'ngbd-modal-content',
  templateUrl: './popup-create-so.html',
  styleUrls: ['./create-so.component.css']
})
@Injectable()
export class NgbdModalContent implements OnInit {

  @Input() name;
  @Input() ngIf: any;
  @Input()
  checked: boolean;
  listemp = ['Ali', 'Ahmed', 'Zayneb'];
  indeterminate = false;
  labelPosition = 'after';
  disabled = false;
  allUser: any;
  // checkModel: any = { dev: "devolepment", Qu: "Quality", Des: "Design", Oth: "Other" };
  myForm: UntypedFormGroup;
  listurg = ['Extremly urgent', 'High', 'Meduim', 'low'];
  listproj = ['HR-Smart', 'PlanetHome', 'Risk'];
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  listdegr = ['bac+1', 'bac+2', 'bac+3', 'bac+4', 'bac+5'];
  listtr = ['training 1', 'training 2', 'training 3', 'training 4', 'training 5'];
  id: any;
  checkModel: any;
  public training = new Training();
  userData: any;
  public prop = new SO();
  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: UntypedFormBuilder,
    private notification: NotificationService,
    private defaultService: DefaultService, private datePipe: DatePipe) {
    setTheme('bs4');
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.bsRangeValue = [this.bsValue, this.maxDate];

  }
  ngOnInit() {
    this.getUsers();
    this.myForm = this.formBuilder.group({
      date: null,
      range: null
    });
  }
  /****************************************/
  /*            public  Methods           */
  /****************************************/
  public onSubmit(proposition, idsmartType) {
    const myDate = new Date();
    proposition.createdAt = myDate;
    this.addSmartObject(proposition);
  }
  /****************************************/
  /*            private  Methods           */
  /****************************************/
  private sendNotification(prop: SO) {
    const notif = new Notification();
    notif.text = prop.creator.firstName + ' ' + prop.creator.lastName + ' proposed ' + prop.subject;
    this.notification.addNotification(notif);
  }

  private getUsers() {
    this.defaultService.getUsers().subscribe((data) => {
      this.allUser = data;
    });
  }

  private setDepartementType(proposition: SO) {
    if (proposition.departement.Design) {
      return 'Design';
    }
    if (proposition.departement.devolepment) {
      return 'development';
    }
    if (proposition.departement.Quality) {
      return 'Quality';
    }
    if (proposition.departement.Other) {
      return 'Other';
    }
  }
  private getSOstatus(proposition: SO) {
    if (proposition.status.Accepted) {
      return 'Accepted';
    }
    if (proposition.status.Onhold) {
      return 'Onhold';
    }
    if (proposition.status.Rejected) {
      return 'Rejected';
    }
  }
  private addSmartObject(proposition: SO) {
    this.userData = JSON.parse(sessionStorage.getItem('currentUser'));
    const dateFormat = String(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));
    const departementType: DepartementEnum = this.setDepartementType(proposition);
    const rest: SmartObjectEntry = {
      id: proposition.type,
      creator: this.userData.code,
      type: proposition.type,
      points: proposition.points,
      subject: proposition.subject,
      departement: departementType,
      date: proposition.date,
      hours: proposition.Hours,
      description: proposition.description,
      moderator: proposition.moderator,
      status: this.getSOstatus(proposition),
      urgency: proposition.urgency,
      createdAt: dateFormat,
      updatedAt: dateFormat
    };
    this.defaultService.addSmartObject(rest).subscribe((so) => {
    });
  }

}
/***********************************************************************************************************
 * *******************************************************************************************************
 * *******************************************************************************************************
 */
@Component({
  selector: 'app-create-so',
  templateUrl: './create-so.component.html',
  styleUrls: ['./create-so.component.css'],
})
@Injectable()
export class CreateSOComponent implements OnInit {

  currentSO: any;
  smartTypes: SmartActionType[];
  selectedSO: any;
  selected: any;
  constructor(private modalService: NgbModal, private smarttypes: SmartActionTypeService) {
  }
  ngOnInit() {
    this.getSmartTypes();
  }

  onSOChanged(SO) {
    this.selectedSO = this.getSelectedSO(SO);
  }
  /****************************************/
  /*            public   Methods           */
  /****************************************/
  public open(smart) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = this.smarttypes.getSmartNameById(smart);
    modalRef.componentInstance.smart = this.currentSO.name;
    modalRef.componentInstance.id = smart;

  }
  /****************************************/
  /*            private  Methods           */
  /****************************************/
  private getSelectedSO(selected: any) {
    return this.getSmartTypes().find(so => so === selected);
  }
  private getSmartTypes() {

    this.smarttypes.getSmartTypes().subscribe(smart => this.smartTypes = smart);
    return this.smartTypes;
  }
}
