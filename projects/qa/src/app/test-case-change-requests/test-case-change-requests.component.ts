import { Component } from '@angular/core';
import { TestCaseChangeRequest } from '../models/TestCaseChangeRequest';

@Component({
  selector: 'app-test-case-change-requests',
  templateUrl: './test-case-change-requests.component.html',
  styleUrls: ['./test-case-change-requests.component.css']
})
export class TestCaseChangeRequestsComponent {
  selectedRequest: TestCaseChangeRequest;
  treatedRequestId: number;

  public detectSelectedRequest(testCaseChangeRequest: TestCaseChangeRequest): void {
    this.selectedRequest = testCaseChangeRequest;
  }

  public detectRequestTreatment(treated: number): void {
    this.treatedRequestId = treated;
  }


}
