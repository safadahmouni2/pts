import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Problem } from '../../models/Problem';
import { ToastrService } from 'ngx-toastr';
import { ProblemServices } from '../../services/problemServices';
import { BsModalService } from 'ngx-bootstrap/modal';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { ProductsServices } from '../../services/productsServices';
import { Globals } from '../../config/globals';


@Component({
  selector: 'app-add-problem',
  templateUrl: './add-problem.component.html',
  styleUrls: ['./add-problem.component.css']
})
export class AddProblemComponent implements OnInit {

  focusedFIeld = '';
  problem = new Problem();
  showUrgencyDropdown = false;
  showProjectDropdown = false;
  projectOptions: [];

  problemForm: UntypedFormGroup;

  @Input() productName: any;
  @Input() userStoryId: any;
  @Input() test;
  @Input() testStep;
  @Output() refreshAssignedTasks = new EventEmitter();


  constructor(
    private modalService: BsModalService, private problemServices: ProblemServices,
    private productsServices: ProductsServices, private toastr: ToastrService,
    public globals: Globals) {

    this.problemForm = new UntypedFormGroup({
      urgency: new UntypedFormControl('', [Validators.required]),
      project: new UntypedFormControl(''),
      shortDescription: new UntypedFormControl('', [Validators.required]),
      longDescription: new UntypedFormControl(''),
      testId: new UntypedFormControl(''),
      testStepId: new UntypedFormControl(''),
      productId: new UntypedFormControl(''),
      productName: new UntypedFormControl(''),
      userStoryId: new UntypedFormControl(''),
      targetSprintId: new UntypedFormControl(''),
      originSprintId: new UntypedFormControl('')
    });
  }

  ngOnInit(): void {
    this.loadProjectOptions();
    this.problemForm.controls.testId.setValue(this.test.testId);
    if (this.testStep != null) {
      this.problemForm.controls.testStepId.setValue(this.testStep.id);
    }
  }

  fieldFocus(event, focusedFIeld) {
    event.target.parentNode.classList.add('focused');
    this.focusedFIeld = focusedFIeld;
  }

  fieldBlur(event) {
    if (event.target.value === '') {
      event.target.parentNode.classList.remove('focused');
    }
    this.focusedFIeld = '';
  }

  toggleUrgencyDropdown() {
    this.showUrgencyDropdown = !this.showUrgencyDropdown;
  }

  toggleProjectDropdown() {
    this.showProjectDropdown = !this.showProjectDropdown;
  }

  setUrgency(event, urgency) {
    this.problemForm.controls.urgency.setValue(urgency);
    this.showUrgencyDropdown = false;
    event.target.parentNode.parentNode.classList.add('focused');
  }

  private loadProjectOptions(): void {
    this.productsServices.getAllProjectsByProductId(+this.globals.getProductId())
      .subscribe(data => {
          this.projectOptions = data;
        }
      );
  }

  setProject(projectName: string, event) {
    this.problemForm.controls.project.setValue(projectName);
    this.showProjectDropdown = false;
    event.target.parentNode.parentNode.classList.add('focused');
  }

  public addProblem(): void {
    if (this.problemForm.valid) {
      this.problemForm.value.productName = this.productName;
      this.problemForm.value.userStoryId = this.test.userStoryId;
      this.problemForm.value.productId = +this.globals.getProductId();
      this.problemForm.value.targetSprintId = +this.globals.getSprintId();
      this.problemForm.value.originSprintId = +this.test.originSprintId;
      this.problemServices.addProblem(this.problemForm.value).subscribe(
        data => {
          this.modalService.hide();
          this.toastr.success('Problem created successfully');
          // this.problemList.push(this.problemForm.value);
          this.refreshAssignedTasks.emit(this.problemForm.value);
        },
        err => { console.log(err); }
      );
    }
  }

  cancel(): void {
    this.modalService.hide();
  }

}
