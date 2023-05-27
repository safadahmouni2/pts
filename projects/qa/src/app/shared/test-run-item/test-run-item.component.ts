import { Component, Input, OnInit } from '@angular/core';
import { Globals } from '../../config/globals';
import { TestRun } from '../../models/TestRun';
import { TestServices } from '../../services/testServices';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-test-run-item',
  templateUrl: './test-run-item.component.html',
  styleUrls: ['./test-run-item.component.css']
})
export class TestRunItemComponent implements OnInit {
  @Input() testRun: TestRun;
  @Input() inProgress: boolean;
  @Input() isCurrentInstall : boolean;
  installInProgress: boolean;
  chatUrl: string;
  isProd = environment.production;
  ok = 0;
  nOk = 0;
  toBeTested = 0;
  collapsed = false;
  tests=[];
  constructor(
    private testServices: TestServices,
    public globals: Globals) { }

  ngOnInit() {
    this.countStatistic(this.testRun);
    this.chatUrl = this.globals.getChatUrl(this.testRun.testRunId, 'test_run');
    setTimeout(() => {
      if (this.inProgress) { this.installInProgress = true; } else { this.installInProgress = false; }
    }, 1000);
  }

  countStatistic(testRun: TestRun): void {
      this.ok = testRun.totalTestOk ;
      this.nOk= testRun.totalTestNotOk ;
      if (this.testRun.totalTests) {
        this.toBeTested = (testRun.totalTests - (this.nOk + this.ok));
      }
    
    }
  collap(){
    this.collapsed=!this.collapsed;
    if(this.collapsed){
    this.testServices.getTestsByTestRun(this.testRun.testRunId).subscribe(
      testsData=>{
        this.tests = testsData;
      }
    )
  }
  }
}
