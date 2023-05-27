import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { Globals } from '../../config/globals';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TestSuiteServices } from '../../services/testSuiteServices';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-test-suite-library',
  templateUrl: './test-suite-library.component.html',
  styleUrls: ['./test-suite-library.component.css']
})
export class TestSuiteLibraryComponent implements OnInit, OnChanges, OnDestroy {

  @Output() selectedTestSuiteId = new EventEmitter();
  @Input() testCaseState: string;
  destroy$ = new Subject<void>();
  public testSuiteList: any[];
  public currentTestSuite: number;

  constructor(public globals: Globals, private testSuiteServices: TestSuiteServices, private spinner: NgxSpinnerService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.testCaseState) {
      if (changes.testCaseState.currentValue != "") {
        this.currentTestSuite = null;
      }
    }

  }

  ngOnInit() {
    this.getTestSuitesByProjectId();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getTestSuitesByProjectId(): void {
    this.spinner.show();
    this.testSuiteServices.getTestSuitesListByProductId(parseInt(this.globals.getProductId()))
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        data => {
          this.testSuiteList = data;
          this.spinner.hide();
        },
        error => {
          console.log('An error was occurred.');
          this.spinner.hide();
        },
        () => {
          console.log('loading test case list was done in test case view.');
        });
  }

  public loadTestCases(testSuiteId: number): void {
    this.selectedTestSuiteId.emit(Object.assign({}, Object.assign({}, { 'testSuiteId': testSuiteId })));
    this.currentTestSuite = testSuiteId;
  }

}
