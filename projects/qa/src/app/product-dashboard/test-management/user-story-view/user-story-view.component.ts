import { Component, Input, OnChanges, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { UserStoryServices } from '../../../services/userStoryServices';
import { NgxSpinnerService } from 'ngx-spinner';
import { Globals } from '../../../config/globals';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject, forkJoin } from 'rxjs';
import { UsTestCase } from '../../../models/UsTestCase';
import { UsTestCaseServices } from '../../../services/usTestCaseServices';
import { EnvironmentServices } from '../../../services/environmentServices';
import { TestCaseServices } from '../../../services/testCaseServices';
import { TestServices } from '../../../services/testServices';
import { UserStoryGrapgQlService } from '../../../services/pts-api/agile/user-story.service';

@Component({
  selector: 'app-user-story-view',
  templateUrl: './user-story-view.component.html',
  styleUrls: ['./user-story-view.component.css']
})
export class UserStoryViewComponent implements OnChanges, OnDestroy {
  userStoryList: any;
  @Input() sprintId;
  @Input() userStoryId;
  @Input() productName;
  @Input() isTestCaseToBeCreated;
  dataLoading = true;
  usTestCase: UsTestCase;
  public usTestCaseList: UsTestCase[];
  destroy$ = new Subject();
  // User story statistics
  ready: number;
  inAnalysis: number;
  inDesign: number;
  inDev: number;
  inTest: number;
  incomplete: number;
  done: number;
  usDetails: any;
  mapOfFilter = new Map();
  stateSelected = '';
  selectedStateList = new Set<string>();
  testRunByUserStory: any = [];
  testsBytestCaseLibraryId: any = [];

  productEnvironments: any = [];
  constructor(
    private userStoryServices: UserStoryServices, private cdRef: ChangeDetectorRef,
    private testService: TestServices,
    private spinner: NgxSpinnerService, private usTestCaseServices: UsTestCaseServices,
    public globals: Globals,
    private environmentServices: EnvironmentServices,
    private testCaseServices: TestCaseServices,
    private userStoryGrapgQlService: UserStoryGrapgQlService) {
  }

  ngOnChanges(): void {
    // Get user stories by sprint id
    this.spinner.show();
    const SearchUserStoryInput = {
      sprintTicketId: this.sprintId
      };
    forkJoin([
      //this.userStoryServices.getUserStoryBySprintId(this.sprintId)

      this.userStoryGrapgQlService.searchUserStories(SearchUserStoryInput)   
      , this.environmentServices.getEnvironmentByProduct(this.productName)])
      .pipe(takeUntil(this.destroy$),
        finalize(() => {
          this.dataLoading = false;
          this.spinner.hide();
        })
      ).subscribe(results => {
        this.productEnvironments = results[1];
        this.userStoryList = [];
        if (this.isTestCaseToBeCreated) {
          this.testCaseServices.getTestCaseListBySprintId(this.sprintId)
            .pipe(takeUntil(this.destroy$))
            .subscribe(testCases => {
              results[0].forEach(element => {
                if ((testCases.filter(testCase => testCase.userStoryId === element.id).length === 0)) {
                  this.userStoryList.push(element)
                }

              })
            })
        } else {
          this.userStoryList = results[0];
        }
        setTimeout(() => {
          this.ready = this.userStoryList.filter(userStory => userStory.state === 'Ready').length;
          this.inAnalysis = this.userStoryList.filter(userStory => userStory.state === 'In Analysis').length;
          this.inDesign = this.userStoryList.filter(userStory => userStory.state === 'In Design').length;
          this.inDev = this.userStoryList.filter(userStory => userStory.state === 'In Dev').length;
          this.inTest = this.userStoryList.filter(userStory => userStory.state === 'In Test').length;
          this.done = this.userStoryList.filter(userStory => userStory.state === 'Done').length;
          this.incomplete = this.userStoryList.filter(userStory => userStory.state === 'Incomplete').length;
        }, 500);
        if (this.userStoryList.length !== 0) {
          // Set userStoryID in session storage to display testcases
          this.saveUserStoryIdLocalStorage(this.userStoryList);
          // Load test cases by UserstoryId
          this.userStoryList.forEach((userStory: any, index: number) => {

            this.getTestCasesByUserStoryId(userStory.id, index);

          });
        }

      },
        () => {
          console.log('An error was occured.');
        });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
  public isFilterSelected(state: string) {
    return this.selectedStateList.has(state);
  }

  public removeUserStoryStateFilter(event, state: string) {
    event.stopImmediatePropagation();
    this.selectedStateList.delete(state);
    this.filterUserStoryState();
  }

  public filterUserStoryState(event?) {
    if (event) {
      const state = event.srcElement.id;
      if (!this.selectedStateList.has(state) && state !== "") {
        this.stateSelected = state;
        this.selectedStateList.add(state);
      }
    }
    this.userStoryServices.getUserStoryBySprintId(this.sprintId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.userStoryList = data;
        if (this.selectedStateList.size !== 0) {
          const filteredUserStoryList = [];
          for (const state of this.selectedStateList) {
            filteredUserStoryList.push(... this.userStoryList.filter(userStory => userStory.state === state));
          }
          this.userStoryList = filteredUserStoryList;
        }
        // Set userStoryID in session storage to display testcases
        this.saveUserStoryIdLocalStorage(this.userStoryList[0]);
        // Load test cases by UserstoryId
        this.userStoryList.forEach((userStory, index) => {
          this.getTestCasesByUserStoryId(userStory.id, index);
        });
      }
      );
  }

  private getTestCasesByUserStoryId(userStoryId: number, userStoryIndex: number): void {
    this.usTestCaseServices.getTestCaseListByUserStoryId(userStoryId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        data => {
          this.userStoryList[userStoryIndex] = Object.assign(this.userStoryList[userStoryIndex], { testsByTestCase: [] });

          this.getTestDetailByUserStory(data, userStoryIndex)
          this.spinner.hide();
        },
        error => {
          console.log('An error was occured.');
          this.spinner.hide();
        },
        () => {
          console.log('loading test case list was done in test case view.');
        });
  }

  private saveUserStoryIdLocalStorage(userStory: any): void {
    if (this.userStoryList[0] != null) {
      this.globals.userStory = this.userStoryList[0];
      this.globals.saveUserStoryId(this.userStoryList[0].id.toString());
    }
  }

  private getTestDetailByUserStory(testcases: any, userStoryIndex: any) {

    testcases.forEach((testCase, testCaseIndex) => {
      this.userStoryList[userStoryIndex].testsByTestCase[testCaseIndex] = {
        testCase: testCase,
      };
    }
    );

  }
}
