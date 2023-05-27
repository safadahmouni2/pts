import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { TestCase } from '../../models/TestCase';
import { TestCaseLibraryService } from '../../services/test-case-library.service';
import { TestCaseLibrary } from '../../models/test-case-library';
import { Globals } from '../../config/globals';
import { TestDTO } from '../../models/TestDTO';
import { TestSuiteServices } from '../../services/testSuiteServices';
import { UserStoryServices } from '../../services/userStoryServices';
import { Subject } from 'rxjs';
import {finalize, takeUntil} from 'rxjs/operators';
import { UserStory } from '../../models/UserStory';
import { UsTestCaseServices } from '../../services/usTestCaseServices';
import { UsTestCase } from '../../models/UsTestCase';
import {NgxSpinnerService} from "ngx-spinner";
import { UserStoryGrapgQlService } from '../../services/pts-api/agile/user-story.service';

@Component({
  selector: 'app-test-case-list',
  templateUrl: './test-case-list.component.html',
  styleUrls: ['./test-case-list.component.css']
})
export class TestCaseListComponent implements OnChanges, OnDestroy {
  @Input() testCaseState: string;
  @Input() testCaseFilter: string;
  @Input() selectedTestSuite: any;
  userStoryList: UserStory[];
  testCaseListByUserStory: TestCaseLibrary[];
  userStoryIdList: any[];
  totalEstimatedEffort = 0;
  testCaseList: TestCase[];
  testCasesSelected: TestDTO[] = [];
  flag: string;
  someTestCaseSelected: number;
  testCaseLibraryList: TestCaseLibrary[] = [];
  filteredTestCaseLibraryList: TestCaseLibrary[] = [];
  testCaseLibrarySelected: TestCaseLibrary[] = [];
  @Output() sendTestCasesSelectedToParent = new EventEmitter();
  @Output() sendFlagToParent = new EventEmitter();
  @Output() sendTotalEstimatedToParent = new EventEmitter();
  receivedInitiateEstimatedEffort = 0;
  receivedResetToZero = 0;
  @Input() resetZero = 0;
  selectAll = false;
  public testCaseDetails: TestCaseLibrary | UsTestCase | null = null;
  public testSteps: any;

  destroy$ = new Subject<void>();


  constructor(
    public globals: Globals,
    private testCaseLibraryServices: TestCaseLibraryService,
    private usTestCaseServices: UsTestCaseServices,
    private testSuiteServices: TestSuiteServices,
    private spinner: NgxSpinnerService,
    private userStoryServices: UserStoryServices, 
    private cdRef: ChangeDetectorRef,
    private userStoryGrapgQlService: UserStoryGrapgQlService) {

  }

  ngOnChanges(changes: SimpleChanges) {
    this.someTestCaseSelected = 0;
    const checkbox = document.getElementById("checkAll") as HTMLInputElement;
    checkbox.checked = false;
    if (changes.testCaseState) {
      console.log(changes.testCaseState);
      if (changes.testCaseState.currentValue != '') {
        this.loadTestCaseListAndUserStoryListBySprintIdAndState();
      }
    }
    if (changes.testCaseFilter) {
      if (changes.testCaseFilter.currentValue != undefined) {
        this.filterTestCase();
      }
    }
    if (changes.selectedTestSuite) {
      // reset totalEstimatedEffortToZero in local component then emit the parent to change it's value
      this.detectChangeSelectedTestSuite(0);
      this.sendTotalEstimatedToParent.emit(this.totalEstimatedEffort);
      // Load test cases using this.selectedTestSuite
      if (this.selectedTestSuite != null) {
        this.testSuiteServices.getTestCaseLibraryByTestSuiteId(this.selectedTestSuite.testSuiteId)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            data => {
              this.testCaseLibraryList = data;
              this.filteredTestCaseLibraryList = this.testCaseLibraryList;
            },
            error => { console.log('An error was occurred.'); },
            () => { console.log('loading test case list was done in test case view.'); }
          );
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public getTitle(tc: TestCaseLibrary | UsTestCase): string {
    const { testCaseLibraryId, testCaseVersion } = tc;

    if ('usTestCaseId' in tc) {
      const { usTestCaseId } = tc;
      return `TC${usTestCaseId}-L${testCaseLibraryId}-V${testCaseVersion}`;
    }

    return `TC${testCaseLibraryId}-V${testCaseVersion}`;
  }

  private loadTestCaseListByUserStoryListId(userStoryIdList): void {
    this.filteredTestCaseLibraryList =[];
    if (userStoryIdList.length > 0) {
      this.spinner.show();
      this.usTestCaseServices.getTestCasesByUserStoryIdList(userStoryIdList)
        .pipe(finalize(() => this.spinner.hide()), takeUntil(this.destroy$))
        .subscribe(
          data => {
            this.testCaseListByUserStory = data;
            this.filteredTestCaseLibraryList = this.testCaseListByUserStory;
            this.spinner.hide();
          },
          error => { console.log('An error was occurred.');},
          () => { console.log('loading test case list was done in test case view.'); }
        );
    }
    this.testCasesSelected = [];
  }


  private loadTestCaseListAndUserStoryListBySprintIdAndState(): void {
    // this.userStoryServices.getUserStoryBySprintId(parseInt(this.globals.getSprintId()))
    //   .subscribe(
    //    data => {
    const SearchUserStoryInput = {
      sprintTicketId: this.globals.getSprintId()
        };
      this.userStoryGrapgQlService.searchUserStories(SearchUserStoryInput)
      .subscribe((userStoriesData) => {
        const userStories = userStoriesData.data.searchUserStories.items
          this.filterUserStoryIdByStateAndLoadTestCaseList(userStories, this.testCaseState);
        },
        error => { console.log('An error was occurred.'); },
        () => { console.log('loading test case list was done in test case view.'); }
      );
  }

  private filterUserStoryIdByStateAndLoadTestCaseList(userStoryList: UserStory[], state: string): void {
    switch (state) {
      case 'DEV':
        this.loadTestCaseListByUserStoryListId(
          userStoryList.filter(
            userStory => {
              return (userStory.state === 'Done' || userStory.state === 'In Test');
            }
          ).map(item => item.id));
        break;
      case 'TEST':
        this.loadTestCaseListByUserStoryListId(
          userStoryList.filter(userStory => userStory.state === 'In Test')
            .map(item => item.id));
        break;
      case 'InLibrary':
        this.filteredTestCaseLibraryList=[];
        this.spinner.show();
        this.testCaseLibraryServices.getTestCaseLibraryByProductId(parseInt(this.globals.getProductId()))
          .pipe(finalize(() => this.spinner.hide()), takeUntil(this.destroy$))
          .subscribe(
            data => {
              this.testCaseLibraryList = data;
              this.filteredTestCaseLibraryList = this.testCaseLibraryList;
              this.spinner.hide();
            },
            error => { console.log('An error was occurred.'); },
            () => { console.log('loading test case list was done in test case view.'); }
          );

        break;
    }
  }

  public checkUncheckAll(event: any): void {
    const isChecked = event.target.checked;
    this.totalEstimatedEffort = 0;
    this.someTestCaseSelected = 0;
    this.testCasesSelected = [];
    for (const testCase of this.filteredTestCaseLibraryList) {
      this.checkUncheckTestCase(testCase, isChecked)
    }
  }

  public checkUncheckTestCase(testCase, allChecked = false, event = null): void {

    const testDTO = new TestDTO();
    let isChecked = allChecked;
    this.testCaseDetails = null;

    if (event) {
      event.stopPropagation();
      isChecked = event.target.checked;
      const checkbox = document.getElementById("checkAll") as HTMLInputElement;
      this.someTestCaseSelected += isChecked ? 1 : -1;
      checkbox.checked = this.someTestCaseSelected === this.filteredTestCaseLibraryList.length;
    } else {
      const checkboxes = document.querySelectorAll("#tc-list-table .checkbox");
      this.someTestCaseSelected = isChecked ? checkboxes.length : 0;
      for (let i = 0; i < checkboxes.length; i++) {
        (checkboxes[i] as HTMLInputElement).checked = isChecked;
      }
    }

    if (isChecked) {
      testCase.executionEstimationTime = testCase.executionEstimationTime || 0;
      this.totalEstimatedEffort += testCase.executionEstimationTime;
      testDTO.testCaseLibraryId = testCase.testCaseLibraryId;
      this.flag = testCase.userStoryId ? 'usTC' : 'libraryTC';
      testDTO.userStoryId = testCase.userStoryId || null;
      this.testCasesSelected.push(testDTO);
    } else {
      this.totalEstimatedEffort -= testCase.executionEstimationTime || 0;
      const index = this.testCasesSelected.findIndex(testDTO => testDTO.testCaseLibraryId === testCase.testCaseLibraryId);
      if (index !== -1) {
        this.testCasesSelected.splice(index, 1);
      }
    }
    this.totalEstimatedEffort = this.someTestCaseSelected === 0 ? 0 : this.totalEstimatedEffort;
    this.sendTestCasesSelectedToParent.emit(this.testCasesSelected);
    this.sendFlagToParent.emit(this.flag);
    this.sendTotalEstimatedToParent.emit(this.totalEstimatedEffort);
  }

  private filterTestCase(): void {
    let source: any[];
    if (this.testCaseLibraryList.length != 0) {
      switch (this.testCaseState) {
        case 'DEV':
        case 'TEST':
          source = this.testCaseListByUserStory;
          break;
        case 'InLibrary':
          source = this.testCaseLibraryList;
          break;
      }
      this.filteredTestCaseLibraryList = source.filter(item =>
        item.shortDescription.toLocaleLowerCase().includes(this.testCaseFilter.toLocaleLowerCase())
      );
    }
  }

  private detectChangeSelectedTestSuite(totalEstimatedEffort: number): void {
    this.receivedResetToZero = totalEstimatedEffort;
    this.cdRef.detectChanges();
    console.log('changes detected');
    this.totalEstimatedEffort = 0;
  }

  /**
   * Open the Test Case details panel
   * @testCase the target Test Case
   */
  openTestCaseDetails(testCase: TestCaseLibrary | UsTestCase) {
    this.testCaseDetails = testCase;


    if ('testStepsLibrary' in testCase) {
      this.testSteps = testCase.testStepsLibrary;
    } else if ('testSteps' in testCase) {
      this.testSteps = testCase.testSteps;
    }
  }


  /**
   * Close the Test Case details panel
   */
  closeTestCaseDetails() {
    this.testCaseDetails = null;
  }

}
