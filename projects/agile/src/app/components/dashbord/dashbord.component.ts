
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Sprint } from '../../models/sprint.model';
import { SprintService } from '../../services/sprint.service';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { StateBySprint } from '../../components/dashbord/StateBySprint.model';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import 'moment-duration-format';
import { Subscription, Observable } from 'rxjs';
import { interval } from 'rxjs';
import { map, filter, scan, mergeMap } from 'rxjs/operators';
import { SprintGrapgQlService } from '../../services/pts-api/agile/sprint.service';
import { StateService } from '../../services/state.service';
import { DailyScrumGrapgQlService } from '../../services/pts-api/agile/daily-scrum.service';
import { StateOption } from '../../models/status-optionmulti.model';

@Component({
  selector: 'app-root',
  templateUrl: './dashbord.template.html',
  styleUrls: ['../../../assets/font/ds-digib-webfont.css'
    , '../../../assets/css/lib/font-awesome/font-awesome.min.css'
    , '../../../assets/font/opensans-regular.css'
    , '../../../assets/css/lib/bootstrap/bootstrap.min.css'
    , '../../../assets/css/ds.css'
    , '../../../assets/font/daily-scrum.css'
    , '../../../assets/css/media-queries.css']
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class Dashbord implements OnInit {

  allSprintStatusOptions: any;
  stateName: any;
  Current_USER: number;
  currentUserCode: string = JSON.parse(sessionStorage.currentUser).usercode;
  sprints: Sprint[] = [];
  currentUserId: number = +JSON.parse(sessionStorage.currentUser).id;
  expanded: boolean = false;
  myProducts: Product[] = [];
  usStatus: boolean = false;
  subscription: Subscription;
  observable: Observable<any>;
  usId: number;
  usLoadingError: boolean;
  // timer
  dsStyleClassMap = {
    'Done': 'row passed-ds',
    'Done earlier': 'row passed-ds',
    'Planned': 'row',
    'Now': 'row actually-ds',
    'Not done': 'row passed-ds'
  };
  allStatusOfUserStory = [];

  constructor(
    private datePipe: DatePipe,
    private sprintService: SprintService,
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private sprintGrapgQlService: SprintGrapgQlService,
    private stateService: StateService,
    public dailyScrumGrapgQlService: DailyScrumGrapgQlService,) { }


  ngOnInit(): void {
    this.getAllStatusOfUserStory();
    this.getMyProducts();
    this.getListState();
  }
  toggleExpanded(): void {
    this.expanded = !this.expanded;
  }

  toogleUsDetails(id): void {
    this.usId = id;
  }

  hideDetail(): void {
    this.usId = null;

  }


  private getMyProducts(): void {
    this.productService.getMyProducts().subscribe(dataSource => {
      this.myProducts = [];
      for (const response of dataSource) {
        const myProduct = new Product();
        myProduct.productId = response.product_id;
        myProduct.productName = response.product_name;
        this.myProducts.push(myProduct);
        
      }
      this.getMyDailyScrums();
    });
  }

  private  getMySprintByProduct(myProduct) {
    this.sprintGrapgQlService.getSprintsByProductId(myProduct.productId).subscribe(sprintsByProduct => {
      myProduct.sprints = [];
      const sprints = sprintsByProduct.data.getSprintsByProductId.items;
      sprints.forEach((sprint)=> {
        const mySprint = new Sprint();
        mySprint.sprintId = sprint.id;
        mySprint.name = sprint.name;
        mySprint.ticketId = sprint.ticketId;
        mySprint.state= mySprint.state= this.allSprintStatusOptions.find(state => state.id === sprint.stateId)?.itemName;
        myProduct.sprints.push(mySprint);
       
      })
    });
  }

  public loadMySprintByProduct($event, myProduct) {
    if ($event) {
      this.getMySprintByProduct(myProduct);
    }
  }

  // Old Impl
  // private getStatusCountUsBySprint(mySprint): void {
  //   this.sprintService.getStatusCountUsBySprint(mySprint.sprintId).subscribe(dataSource2 => {
  //     const allStateBySprint: StateBySprint[] = [];
  //     mySprint.allStateBySprint = [];
  //     for (const response4 of dataSource2) {
  //       const stateBySprint = new StateBySprint();
  //       stateBySprint.sprintId = mySprint.sprintId;
  //       stateBySprint.count = response4.count;
  //       stateBySprint.stateName = response4.name;
  //       stateBySprint.stateId = response4.status_id;
  //       mySprint.allStateBySprint.push(stateBySprint);
  //     }
  //   });
  // }

  // New Impl
  private getCountUsPerStateBySprint(mySprint): void {
    this.sprintGrapgQlService.getCountUsPerStateBySprint(mySprint.sprintId).subscribe(dataSource2 => {
      mySprint.allStateBySprint = [];
      const countPerStates = dataSource2.data.getCountUsPerStateBySprint.items;
      countPerStates.forEach(async (countPerState) => {
        const stateBySprint = new StateBySprint();
        stateBySprint.sprintId = mySprint.sprintId;
        stateBySprint.count = countPerState.count;
        stateBySprint.stateName = this.getStateNameByStateId(countPerState.stateId);
        stateBySprint.stateId = countPerState.stateId;
        mySprint.allStateBySprint.push(stateBySprint);
      });
    });
  }

  public loadStatusCountUsBySprint($event, mySprint) {
    if ($event) {
      this.getCountUsPerStateBySprint(mySprint);
    }
  }

  private getMyDailyScrums(): void {
    let productIds = new Array<number>();
    productIds = this.myProducts.map( (product)=> product.productId );
    this.dailyScrumGrapgQlService.myDailyScrums(productIds).subscribe(dataSource => {
      for (const data of dataSource?.data?.myDailyScrums?.items) {
        const sprint = new Sprint();
        const product = this.myProducts.find(element => element.productId  ===  data.productId);
        sprint.name = data.sprintName;
        sprint.product = product?.productName;
        sprint.dsStartTime = data.dsStartTime;
        sprint.dsEndTime = data.dsEndTime;
        sprint.dsDuration = data.dsDuration;
        sprint.sprintId = data.sprintId;
        sprint.ticketId = data.ticketId;
        //TODO
        sprint.progress = data.sprintProgress || 0;
        sprint.dsState = data.dsStatusInfo;
        sprint.startDate = data.startDate;
        sprint.endDate = data.endDate;
        sprint.dsTimerDeadLineReached = false;
        sprint.ticketId = data.sprintTicketId;
        const dsStartTimeDone = moment(data.dsStartedAt).format('HH:mm:ss');
        const dsEndTimeDone = moment(data.dsFinishedAt).format('HH:mm:ss');
    
        sprint.dsStartTimeDone = dsStartTimeDone?.substring(0, 5);
        sprint.dsEndTimeDone = dsEndTimeDone?.substring(0, 5);
        if (sprint.dsState === 'Now') {
          const hour = dsStartTimeDone.substring(0, 2);
          const minutes = dsStartTimeDone.substring(3, 5);
          const seconds = dsStartTimeDone.substring(6, 8);
          const start_date_as_date = new Date();
          start_date_as_date.setHours(+hour);
          start_date_as_date.setMinutes(+minutes);
          start_date_as_date.setSeconds(+seconds);
          this.subscription = interval(1000).pipe(map((x) => { })).subscribe((x) => {
            const diffmill = Math.floor(new Date().getTime() - start_date_as_date.getTime());
            if (diffmill < 0) {
              sprint.dsTimer = '00:00:00';
            } else {
              sprint.dsTimer = moment.duration(diffmill).format('hh:mm:ss', { trim: false });
              if (!sprint.dsTimerDeadLineReached && (diffmill / 60000) > +sprint.dsDuration) {
                sprint.dsTimerDeadLineReached = true;
              }
            }

          });
        }
        sprint.sm = data.scrumMasterBySprint;
        sprint.progressColor = 'middle-progress'; // data.progressColor = low-progress or hight-progress
        this.sprints.push(sprint);

      }

    },
      err => {

      }
    );
  }

  loadchart(sprintId) {
    this.router.navigate(['sprint-chart', sprintId]);
  }

  public routing(sprintId, stateId): void {
    this.router.navigate(['/user-story-status-change', sprintId, stateId]);

  }
  public openMeetingDashbord(event, sprint) {
    event.stopPropagation();
    switch (sprint?.state) {
      case 'Review':
        this.router.navigate(['/review/', sprint.ticketId]);
    }
  }
   async getStateName(stateId):Promise<any> {
     
    return new Promise((resolve) => {
      let stateName: string;
      this.stateService.getStateById(stateId).subscribe(state => {
        if (state) {
          stateName = state[0].statusName;
          console.log("stateName",stateName);
          resolve(stateName);
        }
      });
    })
  }

  private getStateNameByStateId(status_id: number): string {
    return this.allStatusOfUserStory.find(obj => obj.status_id === status_id)?.name;
  }

  private getAllStatusOfUserStory(): void {
    this.stateService.getAllStatusOfUserStory().subscribe(states => {
      if (states) {
        this.allStatusOfUserStory = states;
      }
    });
  }

  private getListState(): void {
    this.stateService.getAllStatusOfSprint()
      .pipe(map((dataSource: any) => dataSource.map(statusItem => {
        const statusOption = new StateOption();
        statusOption.id = statusItem.status_id;
        statusOption.itemName = statusItem.name;
        return statusOption;
      })))
      .subscribe(dataSource => {
        this.allSprintStatusOptions = dataSource;
      });
  }

}
