import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TestEffort } from '../../models/TestEffort';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-save-effort-dialog',
  templateUrl: './save-effort-dialog.component.html',
  styleUrls: ['./save-effort-dialog.component.css']
})
export class SaveEffortDialogComponent implements OnInit {

  @Input() title: string;
  @Input() message: string;
  @Input() testId: number;
  @Input() testShortDescription: string;
  @Input() testEffort: any;
  @Output() sendTestEffort = new EventEmitter();

  showEffortDropdown = false;
  clicked = false;

  time = environment.popupTimeOut;
  timer: any;
  progress = 0;
  effortForm: FormGroup;

  effortList = [
    { key: '5 min', value: '00:05:00' },
    { key: '10 min', value: '00:10:00' },
    { key: '15 min', value: '00:15:00' },
    { key: '20 min', value: '00:20:00' },
    { key: '25 min', value: '00:25:00' },
    { key: '30 min', value: '00:30:00' }
  ];



  constructor(private activeModal: NgbActiveModal, private elementRef: ElementRef, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.effortForm = this.formBuilder.group({
      effort: ['', Validators.required]
    });
    this.startTimer();
    this.selectEffort(this.testEffort.effortByLine);
  }

  public decline() {
    clearInterval(this.timer);
    this.activeModal.close(false);
  }

  public accept() {
    if (this.effortForm.valid) {
      clearInterval(this.timer);
      this.testEffort.effortByLine = this.effortForm.get('effort').value;
      this.sendTestEffort.emit(this.testEffort);
      this.activeModal.close(true);
    }
  }

  public dismiss() {
    clearInterval(this.timer);
    this.activeModal.dismiss();
  }

  public fieldFocus(event): void {
    event.target.parentNode.classList.add('focused');
  }

  public fieldBlur(event): void {
    if (event.target.value === '') {
      event.target.parentNode.classList.remove('focused');
    }
  }
  public toggleEffortDropdown() {
    this.showEffortDropdown = !this.showEffortDropdown;
  }

  get effortControl() {
    return this.effortForm.get('effort');
  }
  public selectEffort(effort: string) {
    this.effortControl.setValue(effort);
  }

  public isInvalid(controlName: string) {
    const control = this.effortForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }


  public onPopupClick() {
    if (!this.clicked) {
      clearInterval(this.timer)
    }
    this.clicked = true;
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.time--;
      this.progress = 100 - (this.time * 100) / environment.popupTimeOut; // calculate the progress percentage
      if (this.time == 0) {
        this.accept();
        clearInterval(this.timer);
      }
    }, 1000);
  }
}
