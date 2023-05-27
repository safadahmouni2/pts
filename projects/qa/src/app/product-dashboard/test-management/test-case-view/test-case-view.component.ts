import { Component, Input, OnChanges } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UsTestCase } from '../../../models/UsTestCase';
import { UsTestCaseServices } from '../../../services/usTestCaseServices';
import { UserStoryServices } from '../../../services/userStoryServices';
@Component({
  selector: 'app-test-case-view',
  templateUrl: './test-case-view.component.html',
  styleUrls: ['./test-case-view.component.css']
})

export class TestCaseViewComponent implements OnChanges {
  public testCaseList: UsTestCase[];
  @Input() sprintId: number;
  destroy$ = new Subject();
  ready: number;
  inAnalysis: number;
  inDesign: number;
  inDev: number;
  inTest: number;
  incomplete: number;
  done: number;
  public listUserStoryWithTC: any[];
  stateSelected = '';
  selectedStateList = new Set<string>();
  dataLoading = false;
  public stateLoading = false;
  constructor(private userStoryServices: UserStoryServices, private testCaseServices: UsTestCaseServices,
    private spinner: NgxSpinnerService) {
    this.listUserStoryWithTC = this.userStoryServices.sharedUserStoryAndTestCaseList.value?.filter((us) => { return us?.testsByTestCase?.length > 0 });
    this.setCountStateOfUS(this.listUserStoryWithTC);
  }

  ngOnChanges(): void {
    this.spinner.show();
    this.getTestCaseListBySprintId(this.sprintId);
    this.listUserStoryWithTC = this.userStoryServices.sharedUserStoryAndTestCaseList.value?.filter((us) => { return us?.testsByTestCase?.length > 0 });
    if (this.listUserStoryWithTC) this.setCountStateOfUS(this.listUserStoryWithTC);
  }

  public setCountStateOfUS(listUserStoryWithTC: any) {
    enum StatusEnum {
      Ready = 'Ready', InAnalysis = 'In Analysis', InDesign = 'In Design', InDev = 'In Dev'
      , Incomplete = 'Incomplete', DONE = 'Done', InTest = 'In Test'
    }
    if (listUserStoryWithTC && listUserStoryWithTC.length > 0) {
      this.done = listUserStoryWithTC.reduce((n, e) => e.state === StatusEnum.DONE ? n + e.testsByTestCase.length : n, 0);
      this.incomplete = listUserStoryWithTC.reduce((n, e) => e.state === StatusEnum.Incomplete ? n + e.testsByTestCase.length : n, 0);
      this.inDev = listUserStoryWithTC.reduce((n, e) => e.state === StatusEnum.InDev ? n + e.testsByTestCase.length : n, 0);
      this.ready = listUserStoryWithTC.reduce((n, e) => e.state === StatusEnum.Ready ? n + e.testsByTestCase.length : n, 0);
      this.inDesign = listUserStoryWithTC.reduce((n, e) => e.state === StatusEnum.InDesign ? n + e.testsByTestCase.length : n, 0);
      this.inAnalysis = listUserStoryWithTC.reduce((n, e) => e.state === StatusEnum.InAnalysis ? n + e.testsByTestCase.length : n, 0);
      this.inTest = listUserStoryWithTC.reduce((n, e) => e.state === StatusEnum.InTest ? n + e.testsByTestCase.length : n, 0);
      this.stateLoading = true;
    }
  }
  public removeFilterForTestCase(event, state: string) {
    event.stopImmediatePropagation();
    this.selectedStateList.delete(state);
    this.filterTestCaseByUserStoryState();
  }
  public isFilterSelected(state: string) {
    return this.selectedStateList.has(state);
  }

  public filterTestCaseByUserStoryState(event?) {
    this.spinner.show();
    if (event) {
      const state = event.srcElement?.id;
      if (!this.selectedStateList.has(state) && state !== "") {
        this.stateSelected = state;
        this.selectedStateList.add(state);
      }
    }
    if (this.selectedStateList.size !== 0) {
      let listOfTcBySelectedState;
      const filteredTCaseList: UsTestCase[] = [];
      for (const state of this.selectedStateList) {
        listOfTcBySelectedState = this.listUserStoryWithTC.filter(UserStoryWithtC => UserStoryWithtC.state === state).map((tc) => {
          return tc?.testsByTestCase
        });
        listOfTcBySelectedState?.forEach(allUSWithStatusAndTC => {
          allUSWithStatusAndTC?.forEach(value => {
            (value.testCase && value.testCase.length > 0)
              ? value.testCase.forEach((arr) => { filteredTCaseList.push(arr);})
              : filteredTCaseList.push(value?.testCase)
          });
        });
        this.testCaseList = filteredTCaseList;
      }
      this.spinner.hide();
    } else {
      this.getTestCaseListBySprintId(this.sprintId);
    }
  }

  public getTestCaseListBySprintId(sprintId: number): void {
    this.testCaseServices.getTestCaseListBySprintId(sprintId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        data => {
          this.testCaseList = data;
          this.spinner.hide();
        },
        error => {
          console.log('An error was occurred.');
          this.spinner.hide();
        },
        () => { console.log('loading test case list was done in test case view.'); }
      );
  }
}
