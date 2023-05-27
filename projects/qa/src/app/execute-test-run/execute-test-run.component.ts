import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TestRunServices } from '../services/testRunServices';
import { ActivatedRoute } from '@angular/router';
import { TestRun } from '../models/TestRun';
import { Test } from '../models/Test';
import { TestCase } from '../models/TestCase';
import { SharedService } from '../services/shared.service';
import { TestEffortServices } from '../services/testEffortServices';
import { Globals } from '../config/globals';
import { environment } from '../../environments/environment';
import { takeUntil } from 'rxjs/operators';
import { TestServices } from '../services/testServices';
import { Subject } from 'rxjs';
import { TestEffort } from '../models/TestEffort';
import { SaveEffortDialogService } from '../services/save-effort-dialog.service';


@Component({
  selector: 'app-execute-test-run',
  templateUrl: './execute-test-run.component.html',
  styleUrls: ['./execute-test-run.component.css']
})
export class ExecuteTestRunComponent implements OnInit {

  showTestCasesList = true;
  showTestRun = true;
  showUserStory = true;
  testRun: TestRun;
  testSelected: Test;
  tests: Test[];
  dataLogged = false;
  userStoryId: number;
  testCaseList: TestCase[];
  testCaseSelected: TestCase;
  testCaseClass: number;
  isHidden = false;
  newItem: any;
  estimatedEffort: any;
  totalEffort: any;
  testRunId: number;
  diff: any;
  chatUrl: string;
  isProd = environment.production;
  showEditTestComponent = false;
  destroy$ = new Subject<void>();

  testEffort: TestEffort;
  startDateTime: Date;
  endDateTime: Date;
  hr: any = '0' + 0;
  min: any = '0' + 0;
  sec: any = '0' + 0;
  ms: any = '0' + 0;

  startCounter: any;
  running = false;

  constructor(
    private testRunServices: TestRunServices,
    private activatedRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private sharedService: SharedService,
    private testEffortServices: TestEffortServices,
    public globals: Globals,
    public testServices: TestServices,
    private saveEffortDialogService: SaveEffortDialogService) {

  }

  ngOnInit() {
    this.getTestRunById();
    this.endOfTheDay();
  }

  endOfTheDay() {
    setInterval(async () => {
      const now = new Date();
      const endOfDay = environment.EOD;
      const endOfDayTimeArray = endOfDay.split(':');
      if (now.getHours() === +endOfDayTimeArray[0] && now.getMinutes() === +endOfDayTimeArray[1] && now.getSeconds() === +endOfDayTimeArray[2]) {
        if (this.running) {
          this.getDuration();
          const confirmed = await this.saveEffortDialogService.confirm(
            'Record you effort',
            'You have reached the end of your working hours for today. Please save your effort for the test run: ' + this.testSelected.testRunId + ' and you can continue testing after that.',
            this.testSelected.testId,
            this.testSelected.shortDescription,
            this.testEffort);
          if (!confirmed) {
            return;
          }
          this.testEffortServices.editTestEffort(confirmed.id, confirmed).subscribe(
            editTestEffortResponse => {
              this.getTotalEffortByTestRunId();
              this.reset();
              this.running = false;
              this.testRun.state = "PAUSED";
            });
        }
      }
    }, 1000);
  }

  getDuration() {
    this.endDateTime = new Date();
    const endTime = this.endDateTime.getHours() +
      ':' + ('0' + (this.endDateTime.getMinutes() + 1)).slice(-2) +
      ':' + ('0' + this.endDateTime.getSeconds()).slice(-2);
    this.testEffort.endTime = endTime;
    const durationEnMs = Math.max(this.endDateTime.getTime() - this.startDateTime.getTime(), 0);
    this.testEffort.effortByLine = Math.floor(durationEnMs / (1000 * 60 * 60)) +
      ':' + Math.floor(durationEnMs / (1000 * 60)) % 60 +
      ':' + Math.floor(durationEnMs / 1000) % 60;

    const hours = Math.floor(durationEnMs / (1000 * 60 * 60));
    const minutes = Math.floor(durationEnMs / (1000 * 60)) % 60;
    const seconds = Math.floor(durationEnMs / 1000) % 60;
    this.testEffort.effortByLine = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  }

  toggleTestCasesList() {
    this.showTestCasesList = !this.showTestCasesList;
    if(!this.showTestCasesList){
      this.showTestRun = true;
    }
  }

  toggleTestRun() {
    this.showTestRun = !this.showTestRun;
    if(!this.showTestRun){
      this.showTestCasesList = true;
    }
  }


  toggleUserStory() {
    this.showUserStory = !this.showUserStory;
  }

  getTestRunById() {
    this.activatedRoute.pathFromRoot[1].url.subscribe(val => {
      this.activatedRoute.params.subscribe(
        (params) => {
          if (params.testRunId !== undefined) {
            this.testRunId = + params.testRunId;
            this.testRunServices.getTestRunById(params.testRunId).subscribe(
              testRunData => {
                this.testRun = testRunData;
                this.testRunId = + params.testRunId;
                this.estimatedEffort = (this.testRun.estimatedEffort) * 60 * 60 * 1000;
                this.estimatedEffort = new Date(this.estimatedEffort).toISOString().slice(11, 19);
                this.testServices.getTestsByTestRun(testRunData.testRunId).pipe(takeUntil(this.destroy$))
                  .subscribe(
                    testsData => {
                      this.tests = testsData;
                      if (this.tests != null && this.tests.length !== 0) {
                        this.userStoryId = testsData[0].userStoryId;
                      }
                      if (this.userStoryId === null) {
                        this.isHidden = true;
                      }
                      this.cdRef.detectChanges();
                    });
                this.getTestEffort();
                this.getTotalEffortByTestRunId();

              }
            );
            this.chatUrl = this.globals.getChatUrl(this.testRunId, 'test_run');
          }
        });
    });
  }

  async detectTestCaseChange(testCase: Test): Promise<void> {

    if (this.running && testCase?.testId !== this.testSelected?.testId) {
      this.getDuration();
      const oldSelectedTest = { ...this.testSelected };
      const oldTestEffort = { ...this.testEffort };
      this.testSelected = testCase;
      this.reset();
      this.start();
      const confirmed = await this.saveEffortDialogService.confirm(
        'Test Run Execution',
        'Please record your test efforts on test: ' + oldSelectedTest.testId
        + ' before moving to test: ' + testCase.testId + '. You can return to test: ' + oldSelectedTest.testId
        + ' at any time. ',
        oldSelectedTest.testId,
        oldSelectedTest.shortDescription,
        oldTestEffort);
      if (!confirmed) {
        return;
      }
      confirmed.testId = oldSelectedTest.testId;
      confirmed.testRunId = oldSelectedTest.testRunId;
      this.testEffortServices.closeTestEffort(confirmed.id, confirmed).subscribe(
        closeTestEffortResponse => {
          this.getTotalEffortByTestRunId();
        });
    } else {
      this.testSelected = testCase;
    }
    this.cdRef.detectChanges();
  }

  userStoryIdChange(val): void {
    if (val != null) {
      this.isHidden = false;
    } else {
      this.isHidden = true;
    }
    this.userStoryId = val;
    this.cdRef.detectChanges();
    this.sharedService.sendClickEvent();
  }

  detectNewItem(newItem): void {
    this.newItem = newItem;
    this.cdRef.detectChanges();
  }

  getTotalEffortByTestRunId() {
    this.testEffortServices.getTotalEffortByTestRunId(this.testRunId).subscribe(
      totalEffortByTestRunId => {
        if (totalEffortByTestRunId) {
          this.totalEffort = totalEffortByTestRunId;
        } else {
          this.totalEffort = '00:00:00';
        }
        const totalEffortTimeArray = this.totalEffort.split(':');

        this.hr = totalEffortTimeArray[0];
        this.min = totalEffortTimeArray[1];
        this.sec = totalEffortTimeArray[2];
        this.getDifferenceBetweenTimes(this.estimatedEffort, this.totalEffort);
      }
    );
  }

  getTestEffort() {
    this.testEffortServices.getLastInCompletedTestEffortByTestRunId(this.testRunId).subscribe(
      lastInCompletedTestEffortByTestRunId => {
        this.testEffort = new TestEffort();
        if (lastInCompletedTestEffortByTestRunId != null) {
          this.testEffort = lastInCompletedTestEffortByTestRunId;
          this.startDateTime = new Date(`${this.testEffort.date}T${this.testEffort.startTime}`);
          if (this.testRun.state === "IN_PROGRESS") {
            this.running = true;
            this.startEffortCounter();
          }
        }

      });
  }

  startEffortCounter() {
    this.endDateTime = new Date();
    const durationEnMs = Math.max(this.endDateTime.getTime() - this.startDateTime.getTime(), 0);

    this.hr = this.padNumber(Number(this.hr) + Math.floor(durationEnMs / (1000 * 60 * 60)));
    this.min = this.padNumber(Number(this.min) + Math.floor(durationEnMs / (1000 * 60)) % 60);
    this.sec = this.padNumber(Number(this.sec) + Math.floor(durationEnMs / 1000) % 60);

    this.startCounter = setInterval(() => {
      this.ms++;
      this.ms = this.padNumber(Number(this.ms));

      if (this.ms === 100) {
        this.sec++;
        this.sec = this.padNumber(Number(this.sec));
        this.ms = this.padNumber(0);
      }

      if (this.sec === 60) {
        this.min++;
        this.min = this.padNumber(Number(this.min));
        this.sec = this.padNumber(0);
      }

      if (this.min === 60) {
        this.hr++;
        this.hr = this.padNumber(Number(this.hr));
        this.min = this.padNumber(0);
      }
    }, 10);
  }

  padNumber(number) {
    return number < 10 ? '0' + number : number;
  }

  start() {
    this.testEffort.effortByLine = null;
    this.testEffort.testId = this.testSelected.testId;
    this.testEffort.testRunId = this.testRunId;

    this.startDateTime = new Date();
    const date = this.startDateTime.getFullYear()
      + '-' + ('0' + (this.startDateTime.getMonth() + 1)).slice(-2)
      + '-' + ('0' + this.startDateTime.getDate()).slice(-2);
    this.testEffort.date = date;
    const startTime = this.startDateTime.getHours() +
      ':' + ('0' + (this.startDateTime.getMinutes() + 1)).slice(-2) +
      ':' + ('0' + this.startDateTime.getSeconds()).slice(-2);
    this.testEffort.startTime = startTime;
    this.testEffort.endTime = null;

    this.testEffortServices.addTestEffort(this.testEffort).subscribe(
      addTestEffortResponse => {
        this.testEffort.id = JSON.parse(addTestEffortResponse).message;
        this.testRun.state = "IN_PROGRESS";
        this.running = true;
        this.startEffortCounter();
      });
  }

  async pause() {
    this.getDuration();
    const confirmed = await this.saveEffortDialogService.confirm(
      'Test Run Execution',
      'Please record your test efforts on test: ' + this.testSelected.testId
      + ' of test run: ' + this.testSelected.testRunId
      + '.You can continue testing at any time.  ',
      this.testSelected.testId,
      this.testSelected.shortDescription,
      this.testEffort);
    if (!confirmed) {
      return;
    }

    this.testEffortServices.editTestEffort(confirmed.id, confirmed).subscribe(
      editTestEffortResponse => {
        this.getTotalEffortByTestRunId();
        this.reset();
        this.running = false;
        this.testRun.state = "PAUSED";
      });

  }


  async finish() {
    this.endDateTime = new Date();
    this.getDuration();
    const confirmed = await this.saveEffortDialogService.confirm(
      'Test Run Execution',
      'Please record your test efforts on test: ' + this.testSelected.testId + ' of the test run : ' + this.testSelected.testRunId
      + ' before finishing the test run execution. Please note that once you have saved your efforts, this test will no longer be editable.',
      this.testSelected.testId,
      this.testSelected.shortDescription,
      this.testEffort);
    if (!confirmed) {
      return;
    }
    this.testEffortServices.finishTestEffort(confirmed.id, confirmed).subscribe(
      finishTestEffortResponse => {
        this.getTotalEffortByTestRunId()
        this.reset();
        this.running = false;
        this.testRun.state = "COMPLETED";
      });
  }
  reset() {
    clearInterval(this.startCounter);
  }

  changeTotalEffort(): void {
    this.getTotalEffortByTestRunId();
    this.cdRef.detectChanges();
  }

  getDifferenceBetweenTimes(estimatedEffort, totalEffort) {
    const t1 = estimatedEffort.split(':');
    const estimatedEffortMs = ((+t1[0]) * 60 * 60 + (+t1[1]) * 60 + (+t1[2])) * 1000;

    const t2 = totalEffort.split(':');
    const totalEffortMs = ((+t2[0]) * 60 * 60 + (+t2[1]) * 60 + (+t2[2])) * 1000;

    if ((estimatedEffortMs - totalEffortMs) < 0) {
      this.diff = Math.abs((estimatedEffortMs - totalEffortMs));
      this.diff = '+' + new Date(this.diff).toISOString().slice(11, 19);
    } else {
      this.diff = '+00:00:00';
    }
  }
  onShowEditTest(showEdit) {
    this.showEditTestComponent = showEdit;

  }

  public fieldFocus(event): void {
    event.target.parentNode.classList.add('focused');
  }

  public fieldBlur(event): void {
    if (event.target.value === '') {
      event.target.parentNode.classList.remove('focused');
    }
  }
}
