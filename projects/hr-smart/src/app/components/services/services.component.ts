import { Component, OnInit, Injectable } from '@angular/core';
import { NgbActiveModal, } from '@ng-bootstrap/ng-bootstrap';
import { setTheme } from 'ngx-bootstrap/utils';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
@Injectable()
export class ServicesComponent implements OnInit {

  checked: boolean;
  listemp = ['Ali', 'Ahmed', 'Zayneb'];
  currentemp: string = '';
  selectedemp: string;
  indeterminate = false;
  labelPosition = 'after';
  disabled = false;
  checkModel: any = { dev: false, Qu: false, Des: false, Oth: false };
  myForm: UntypedFormGroup;
  listurg = ['Extremly urgent', 'Urgent', 'High', 'Meduim', 'low'];
  currenturg: string = '';
  selectedurg: string;
  listproj = ['HR-Smart', 'PlanetHome', 'Risk'];
  currentproj: string = '';
  selectedproj: string;
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  listdegr = ['bac+1', 'bac+2', 'bac+3', 'bac+4', 'bac+5'];
  currentdegr: string = '';
  selecteddegr: string;
  listtr = ['training 1', 'training 2', 'training 3', 'training 4', 'training 5'];
  currenttr: string = '';
  selectedtr: string;

  constructor(public activeModal: NgbActiveModal, private formBuilder: UntypedFormBuilder) {
    setTheme('bs4');
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.bsRangeValue = [this.bsValue, this.maxDate];
  }
  ngOnInit() {
    this.myForm = this.formBuilder.group({
      date: null,
      range: null
    });
  }
}
