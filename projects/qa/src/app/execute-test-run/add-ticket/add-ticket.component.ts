import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Ticket } from '../../models/Ticket';
import { ToastrService } from 'ngx-toastr';
import { TicketServices } from '../../services/ticketServices';
import { ProductsServices } from '../../services/productsServices';
import { ResponsibleServices } from '../../services/responsibleServices';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Globals } from '../../config/globals';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Project } from '../../models/Project';

@Component({
  selector: 'app-add-ticket',
  templateUrl: './add-ticket.component.html',
  styleUrls: ['./add-ticket.component.css'],
})
export class AddTicketComponent implements OnInit {
  focusedFIeld = '';
  ticket = new Ticket();
  showUrgencyDropdown = false;
  showProjectDropdown = false;
  showResponsibleDropdown = false;
  projectOptions: [];
  responsibleList: any;
  ticketForm: UntypedFormGroup;
  urgencyOptions = ['Low', 'Medium', 'High', 'Extremely_urgent'];
  showStatusDropdown = false;
  urgency: any


  @Input() test;
  @Input() testStep;
  @Input() userStoryId: any;
  @Input() productName: any;
  @Output() refreshAssignedTasks = new EventEmitter();

  constructor(
    private modalService: BsModalService,
    private ticketServices: TicketServices,
    private projectsServices: ProductsServices,
    private responsibleServices: ResponsibleServices,
    private toastr: ToastrService,
    public globals: Globals
  ) {
    this.ticketForm = new UntypedFormGroup({
      responsible: new UntypedFormControl('', [Validators.required]),
      urgency: new UntypedFormControl(),
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

  ngOnInit() {

    this.loadProjectOptions();
    this.getResponsibleList(this.userStoryId);
    this.ticketForm.controls.testId.setValue(this.test.testId);
    if (this.testStep != null) {
      this.ticketForm.controls.testStepId.setValue(this.testStep.id);
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

  setUrgency(urgency: string, event) {
    this.ticketForm.controls.urgency.setValue(urgency);
    this.showUrgencyDropdown = false;
    }

  getResponsibleList(US): void {
    this.responsibleServices
      .getAllResponsibleByProductName(this.globals.getProductName())
      .subscribe((data) => {
        this.responsibleList = data;
      });
  }

  setResponsible(code: string, event) {
    this.ticketForm.controls.responsible.setValue(code);
    this.showResponsibleDropdown = false;
    event.target.parentNode.parentNode.classList.add('focused');
  }

  toggleResponsibleDropdown() {
    this.showResponsibleDropdown = !this.showResponsibleDropdown;
  }

  private loadProjectOptions(): void {
    this.projectsServices
      .getAllProjectsByProductId(+this.globals.getProductId())
      .subscribe((data) => {
        this.projectOptions = data;
      });
  }

  setProject(projectName: string, event) {
    this.ticketForm.controls.project.setValue(projectName);
    this.showProjectDropdown = false;
    event.target.parentNode.parentNode.classList.add('focused');
  }

  toggleProjectDropdown() {
    this.showProjectDropdown = !this.showProjectDropdown;
  }

  public addTicket(): void {
    if (this.ticketForm.valid) {
      this.ticketForm.value.productName = this.productName;
      this.ticketForm.value.userStoryId = this.test.userStoryId;
      this.ticketForm.value.productId = +this.globals.getProductId();
      this.ticketForm.value.targetSprintId = + this.globals.getSprintId();
      this.ticketForm.value.originSprintId = + this.test.originSprintId;
      this.ticketServices.addTicket(this.ticketForm.value).subscribe(
        (data) => {
          this.modalService.hide();
          this.toastr.success('Ticket created successfully');
          // this.ticketList.push(this.ticketForm.value);
          this.refreshAssignedTasks.emit(this.ticketForm.value);
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  cancel(): void {
    this.modalService.hide();
  }
}
