import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ProductsServices } from '../services/productsServices';
import { SprintsService } from '../services/sprintsService';
import { UserStoryServices } from '../services/userStoryServices';
import { EnvironmentServices } from '../services/environmentServices';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TestRunServices } from '../services/testRunServices';
import { Globals } from '../config/globals';
import { Router } from '@angular/router';
import { TestCaseServices } from '../services/testCaseServices';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import { UserStoryGrapgQlService } from '../services/pts-api/agile/user-story.service';
import { SprintGrapgQlService } from '../services/pts-api/agile/sprint.service';
import { Sprint } from '../models/Sprint';
import { UserStory } from '../models/UserStory';

@Component({
  selector: 'app-tester-dashboard',
  templateUrl: './tester-dashboard.component.html',
  styleUrls: ['./tester-dashboard.component.css']
})
export class TesterDashboardComponent implements OnInit, OnDestroy {


  allStatusOfUserStory: any;
  destroy$ = new Subject();
  sprintList= [];
  productList: any = [];
  productDetailList: any = [];
  environmentList: any;
  testRuns: any;
  testByUs: any = [];
  installList: any = [];

  constructor(
    private productsServices: ProductsServices,
    private sprintsServices: SprintsService,
    private testCaseServices: TestCaseServices,
    private userStoryServices: UserStoryServices,
    private environmentServices: EnvironmentServices,
    private testRunService: TestRunServices,
    private cdRef: ChangeDetectorRef,
    public globals: Globals,
    private route: Router,
    private spinner: NgxSpinnerService,
    public datePipe: DatePipe,
    private userStoryGrapgQlService: UserStoryGrapgQlService,
    private sprintGrapgQlService : SprintGrapgQlService
  ) { }

  ngOnInit(): void {
    this.loadProductList();
    this.getAllStatusOfUserStory();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  private loadProductList(): void {
    let numberOfProduct = 0;
    let sprintsCount = 0;
    this.spinner.show();
    this.productsServices.getAllProductsByUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe(

        data => {

          this.productList = data;
          this.cdRef.detectChanges();

          this.productDetailList = [];
          let numberOfLastproduct = 0

          this.productList.forEach((product, index) => {
            
            this.sprintGrapgQlService.getSprintsByProductId(product.product_id)
              .pipe(takeUntil(this.destroy$))
              .subscribe(sprintsByProductId => {
                let sprints = sprintsByProductId.data.getSprintsByProductId.items;
                numberOfProduct++;

                //stateId: 1017798 , state : inProgress
                sprints = sprints.filter(sprint => sprint.stateId === 1017798);
                this.cdRef.detectChanges();
                if (sprints.length !== 0) {
                  
                  sprints.forEach((sprint, sprintIndex) => {
                    sprintsCount++;
                    const mySprint = new Sprint();
                    mySprint.sprintId = sprint.id;
                    mySprint.name = sprint.name;
                    mySprint.stateId = sprint.stateId;
                    mySprint.ticketId = sprint.ticketId;
                    mySprint.startDate = sprint.startDate;
                    mySprint.endDate = sprint.endDate;
                    this.sprintList.push(mySprint);
                    if (sprintIndex > 0) {
                      numberOfLastproduct++;
                      this.productDetailList[this.productList.length + numberOfLastproduct] = {
                        deadlineInDays: null,
                        product: null,
                        userStoryInTest: null,
                        userStoryInDev: null,
                        userStoryDone: null,
                        testCaseCreated: null,
                        userStoryToBeCreatedInTest: null,
                        usIndesign: null,
                        usReady: null,
                        usInAnalysis: null,
                        openTestRuns: null,
                      };
                      this.productDetailList[this.productList.length + numberOfLastproduct].product = product;
                      this.getSprintDetail(sprint, this.productDetailList[this.productList.length + numberOfLastproduct],numberOfProduct,sprintsCount === this.sprintList.length);

                    } else {
                      this.productDetailList[index] = {
                        deadlineInDays: null,
                        product: null,
                        userStoryToBeCreatedInTest: null,
                        userStoryInDev: null,
                        userStoryDone: null,
                        testCaseCreated: null,
                        userStoryInTest: null,
                        usIndesign: null,
                        usReady: null,
                        usInAnalysis: null,
                        openTestRuns: null,
                        environment: []
                      };
                      let openTestRun = 0;
                      this.productDetailList[index].product = product;

                      this.getSprintDetail(sprint, this.productDetailList[index],numberOfProduct,sprintsCount === this.sprintList.length);
                      this.environmentServices.getEnvironmentByProduct(product.product_name)
                        .pipe(takeUntil(this.destroy$))
                        .subscribe(
                          data => {
                            this.environmentList = data;
                            data.forEach((env, envIndex) => {
                              this.productDetailList[index].environment[envIndex] = {
                                envType: null,
                                installedRelease: null,
                                numberTotalOfTestRuns: null,
                                numberOfTestRunsToBeExecuted: null,
                                percentageOfExecutedTestRun: null

                              };

                              if (env.Install_id !== '') {
                                this.testRunService.getTestRunByInstall(env.Install_id).pipe(takeUntil(this.destroy$)).subscribe(
                                  testRuns => {
                                    this.productDetailList[index].environment[envIndex].envType = env.Env_type;
                                    this.productDetailList[index].environment[envIndex].installedRelease = env.Installed_release;
                                    this.productDetailList[index].environment[envIndex].percentageOfExecutedTestRun = 0;
                                    let ok = 0;
                                    let nOk = 0;

                                    let numberOfTestRunsToBeExecuted = 0;
                                    let numberTotalOfTests = 0;
                                    testRuns.forEach(testRun => {

                                      numberTotalOfTests = numberTotalOfTests + testRun.totalTests;
                                      nOk = nOk + testRun.totalTestNotOk;
                                      ok = ok + testRun.totalTestOk;
                                      numberOfTestRunsToBeExecuted = numberOfTestRunsToBeExecuted + (numberTotalOfTests - (nOk + ok));
                                      this.cdRef.detectChanges();
                                    });

                                    this.productDetailList[index].environment[envIndex].numberOfTestRunsToBeExecuted = numberOfTestRunsToBeExecuted;
                                    this.productDetailList[index].environment[envIndex].numberOfTestRunsExecuted = nOk + ok;
                                    this.productDetailList[index].environment[envIndex].numberTotalOfTestRuns = numberTotalOfTests;


                                    if (numberOfTestRunsToBeExecuted) {
                                      openTestRun++;
                                      this.productDetailList[index].openTestRuns = openTestRun;
                                    }
                                    this.cdRef.detectChanges();


                                    if (numberTotalOfTests !== 0) {
                                      this.productDetailList[index].environment[envIndex].percentageOfExecutedTestRun = Math.round(((nOk + ok) / numberTotalOfTests) * 100);
                                    }
                                  });
                                this.cdRef.detectChanges();
                              }
                            });
                          });
                    }
                  });
                  this.cdRef.detectChanges();
                }
              }
              );
          });
        }
      );
  }

  private getSprintDetail(sprint: any, product: any,numberOfProduct,isLastSprint) {
    product.deadlineInDays = sprint.expirationInDays;
    const deadlineOfSprint = Math.round((new Date(sprint.endDate).getTime() - new Date(sprint.startDate).getTime()) / (1000 * 60 * 60 * 24));
    const deadlineFromStartDate = Math.round((new Date(Date.now()).getTime()) - new Date(sprint.startDate).getTime()) / (1000 * 60 * 60 * 24);
    const percentageOfDeadline = (deadlineFromStartDate / deadlineOfSprint) * 100;

    product.colorOfDeadline = { success: true, warning: false, danger: false };
    if (percentageOfDeadline > 75) {
      product.colorOfDeadline = {
        success: false, warning: true, danger: false
      };
    }

    if (percentageOfDeadline > 100) {
      product.colorOfDeadline = {
        success: false, warning: false, danger: true
      };
    }


    product.sprint = sprint;
    product.startDate = this.datePipe.transform(sprint.startDate, 'dd.MM');
    product.endDate = this.datePipe.transform(sprint.endDate, 'dd.MM');

    const SearchUserStoryInput = {
      sprintTicketId: sprint ?.ticketId
      };
    this.userStoryGrapgQlService.searchUserStories(SearchUserStoryInput)
      .pipe(takeUntil(this.destroy$))
      .subscribe((userStoriesData) => {

        const userStories = userStoriesData.data.searchUserStories.items

        let userStoryToBeInTest = 0;
        let userStoryInDev = 0;
        let userStoryDone = 0;
        let usReady = 0;
        let usInAnalysis = 0;
        let usIndesign = 0;
        let userStoryToBeCreatedInTest = 0;
        if (sprint.ticketId != null) {
          this.testCaseServices.getTestCaseListBySprintId(sprint.ticketId)
            .pipe(takeUntil(this.destroy$))
            .subscribe((testCasesData) => {

              userStories.forEach(element => {
                const userStory = new UserStory();
                userStory.id = element.id;

                userStory.state = this.allStatusOfUserStory.find(state => state.status_id == element.stateId) ?.name ;

                if (userStory.state === 'In Test') {
                  userStoryToBeInTest++;
                }

                if ((testCasesData.filter(testCase => testCase.userStoryId === element.id).length === 0)) {
                  switch (userStory.state) {
                    case 'Ready':
                      usReady++;
                      break;
                    case 'In Analysis':
                      usInAnalysis++;
                      break;
                    case 'In Dev':
                      userStoryInDev++;
                      break;
                    case 'In Test':
                      userStoryToBeCreatedInTest++;
                      break;
                    case 'Done':
                      userStoryDone++
                      break;
                    case 'In Design':
                      usIndesign++;
                      break;
                    default:
                      break;
                  }
                }

                product.userStoryDone = userStoryDone;
                product.userStoryToBeCreatedInTest = userStoryToBeCreatedInTest;
                product.userStoryInTest = userStoryToBeInTest;
                product.userStoryInDev = userStoryInDev;
                product.usInAnalysis = usInAnalysis;
                product.usIndesign = usIndesign
                product.usReady = usReady;
                product.testCaseCreated = userStoryDone + userStoryToBeCreatedInTest + userStoryInDev + usInAnalysis + usReady + usIndesign;
              });

            })
        }
        this.cdRef.detectChanges();
        if((numberOfProduct === this.productList.length) && isLastSprint){
        this.spinner.hide();
        }
      });
  }
  showDetail(productDetail: any) {
    this.globals.product = productDetail.product;
    this.globals.saveProductId(productDetail.product.product_id);
    this.globals.saveProductName(productDetail.product.product_name.toString());
    this.globals.sprint = productDetail.sprint;
    this.globals.saveSprintId(productDetail.sprint.ticketId);
    this.globals.saveSprintState(productDetail.sprint.State);
    this.route.navigate(['product-dashboard']);

  }

  //get all US states
  private getAllStatusOfUserStory(): void {
    this.userStoryServices.getAllStatusOfUserStory().subscribe(states => {
      if (states) {
        this.allStatusOfUserStory = states;
      }
    });
  }
}
