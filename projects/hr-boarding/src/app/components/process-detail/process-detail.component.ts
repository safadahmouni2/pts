import { Component, OnInit } from '@angular/core';
import { RequestJsonDataService } from '../../services/requestJsonData.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TasksCategorieModel } from '../../models/tasksCategorie.model';
import { User } from '../../models/user.model';
import { ProcessModel } from '../../models/process.model';


@Component({
  selector: 'app-process-detail',
  templateUrl: './process-detail.component.html',
  styleUrls: ['./process-detail.component.css']
})
export class ProcessDetailComponent implements OnInit {
  processListDetail: any[] = [];
  tasksCategorie: TasksCategorieModel[];
  processID: number;
  processDetail: any;
  currentUSER: User;
  chatMode: string;
  task: any[] = [];
  constructor(private requestJsonDataService: RequestJsonDataService, private router: ActivatedRoute) {
    this.processDetail = new ProcessModel();
  }
  ngOnInit() {
    this.onGetCurrentUser();
    this.router.params.subscribe(params => {
      console.log(params['id']);
      this.processID = params['id'];
      this.onGetProcessCategorie(params['id']);
    });
    this.onGetProcessDetail(this.processID);
    console.log(' NAME OF USER IS ' + this.processDetail);
  }

  onGetTasksByProcessAndCategorieID(processID: number, processCategorieID: number): void {
    this.requestJsonDataService.getTasksByProcessAndCategorieID(processID, processCategorieID).subscribe(data => {
      this.processListDetail[processCategorieID].data = data;
    });
  }

  onGetProcessCategorie(processId: number): void {
    this.requestJsonDataService.getTasksTasks(processId).subscribe(data => {

      this.tasksCategorie = data;
    });
  }

  getTasksList(processCategorieID: number): void {
    if (this.processListDetail[processCategorieID] && this.processListDetail[processCategorieID].expanded) {
      this.processListDetail[processCategorieID].expanded = false;
    } else {
      this.processListDetail[processCategorieID] = { expanded: true, data: [] };
      this.onGetTasksByProcessAndCategorieID(this.processID, processCategorieID);
    }
  }

  getLongDescription(desc): void {
    if (desc.expanded) {
      desc.expanded = false;
    } else {
      desc.expanded = true;
    }

  }

  toggleActionMenu(processdetail): void {
    processdetail.openActionMenu = !processdetail.openActionMenu;
  }
  onGetProcessDetail(idparam: number): void {
    this.requestJsonDataService.getProcesDetail(idparam)

      .subscribe(processData => {

        this.processDetail = processData[0];
        console.log('data' + this.processDetail.id);

      });
  }

  chatAction(action: number, userCode: number, taskID: number) {
    switch (action) {
      case 1:
        this.chatMode = 'start_chat';
        console.log('You are in mode ' + this.chatMode + 'AND your Task opned is ' + taskID);
        break;
      case 2:
        this.chatMode = 'coment';
        console.log('You are in mode ' + this.chatMode + ' AND your Task opned is ' + taskID);
        break;
      case 3:
        this.chatMode = 'edit_task';
        console.log('You are in mode ' + this.chatMode + ' AND your Task opned is ' + taskID);
        break;

    }

  }

  onGetCurrentUser(): void {
    this.requestJsonDataService.getCurrentUser().subscribe(dataSource => {
      const loggedUser = new User();
      for (const data of dataSource) {
        loggedUser.photo = data.photo;
        loggedUser.id = data.user_id;
        loggedUser.code = data.user_code;
      }
      this.currentUSER = loggedUser;
    });
  }

  toggleTaskExpanded(task): void {
    task.expanded = !task.expanded;
  }

  openLinkInNewTab(urlLink): void {
    window.open(urlLink, 'PTS');
  }
}
