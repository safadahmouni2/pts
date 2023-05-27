
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DatePipe } from '@angular/common';
import { RequestJsonDataService } from '../../services/requestJsonData.service';
import { TicketService } from '../../services/ticket.service';
import { ProcessType } from '../../models/processType.model';
import { ProcessModel } from '../../models/process.model';
import { User } from '../../models/user.model';
import { Departement } from '../../models/departement.model';

@Component({
  selector: 'app-root',
  templateUrl: './dashbord.component.html'
})
export class DashbordComponent implements OnInit {
  processTypes: ProcessType[] = [];
  processList: ProcessModel[] = [];
  loggedUser: User;
  mode: string;
  tasks: any[] = [];
  selectedProcessTypeId: any;
  public searchString: string;
  departements: Departement[] = [];
  selectedDepartementValue: any;
  constructor(
      private requestJsonDataService: RequestJsonDataService
    , private ticketService: TicketService
    , private router: Router
    , private datePipe: DatePipe
    , private activatedRoute: ActivatedRoute) {


  }

  ngOnInit(): void {
    // subscribe to router event
    this.activatedRoute.queryParams
      // .filter(params => params.order)
      .subscribe((params: Params) => {
        if (params['process']) {
          this.selectedProcessTypeId = params['process'];
        }
        if (params['department']) {
          this.selectedDepartementValue = params['department'];
        }
      });

    this.mode = 'without';
    this.getProcessTypes();
    this.getDepartements();
    this.getProcess();
    this.requestJsonDataService.getMyOpenedTasks().subscribe(res => { this.tasks = res; });
    this.requestJsonDataService.getCurrentUser().subscribe(dataSource => {
      const loggedUser = new User();
      for (const data of dataSource) {
        loggedUser.photo = data.photo;
        loggedUser.id = data.user_id;
        loggedUser.code = data.user_code;
      }
      this.loggedUser = loggedUser;
    });
  }

  getProcessTypes(): void {
    this.requestJsonDataService.getProcessTypes().subscribe(processTypeDataSet => {
      this.processTypes = [];
      for (const data of processTypeDataSet) {
        const processType = new ProcessType();
        processType.id = data.id;
        processType.name = data.name;
        this.processTypes.push(processType);
      }

    });
  }

  getProcess(): void {
    this.requestJsonDataService.getBoardingDashboard().subscribe(data => {
      this.processList = data;
    });
  }
  toggleTaskExpanded(task): void {
    task.expanded = !task.expanded;
  }
  /*
    goToProcess(id1: any, id2: any ): void {
      this.router.navigate([ 'process' ],{ queryParams: { param1: id1, param2: id2}});
        }*/



  closeProcess(ticketId): void {
    if (confirm('Are you sure to close process?')) {
      this.ticketService.updateState(ticketId, 1022968, 'Closed', this.loggedUser.id).subscribe(data => {
        this.getProcess();
      });
    }
  }

  getDepartements(): void {
    this.requestJsonDataService.getDepartements().subscribe(departementDataSet => {
      this.departements = [];
      for (const data of departementDataSet) {
        const departement = new Departement();
        departement.value = data.value;
        departement.label = data.label;
        this.departements.push(departement);
      }

    });
  }

  openLinkInNewTab(urlLink): void {
    window.open(urlLink, 'PTS');
  }

}
