import { Component, OnInit } from '@angular/core';
import { Globals } from '../../config/globals';

@Component({
  selector: 'app-test-management',
  templateUrl: './test-management.component.html',
  styleUrls: ['./test-management.component.css']
})
export class TestManagementComponent implements OnInit {

  public isUserStoryView: boolean;
  isTestCaseToBeCreated = false

  constructor(public globals: Globals) { }

  ngOnInit(): void {
    this.isUserStoryView = true;
  }

  public changeView(isUserStoryView, isTestCaseToBeCreated): void {
    this.isUserStoryView = isUserStoryView;
    this.isTestCaseToBeCreated = isTestCaseToBeCreated

  }

}
