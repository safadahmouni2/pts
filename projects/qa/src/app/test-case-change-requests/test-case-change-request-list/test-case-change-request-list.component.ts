import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Globals } from '../../config/globals';
import { TestCaseChangeRequest } from '../../models/TestCaseChangeRequest';
import { TestCaseChanges } from '../../models/TestCaseChanges';
import { TestCaseChangeRequestService } from '../../services/test-case-change-request.service';
import { TestCaseChangesService } from '../../services/test-case-changes.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-test-case-change-request-list',
  templateUrl: './test-case-change-request-list.component.html',
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    '[class.hidden]': '!showChangeRequestList'
  },
  styleUrls: ['./test-case-change-request-list.component.css']
})
export class TestCaseChangeRequestListComponent implements OnInit, OnChanges {

  showChangeRequestList = true;
  selectedTestCaseChangeRequestId: number;
  testCaseChangeRequestList: TestCaseChangeRequest[];
  isProd = environment.production;
  @Output() selectedRequest = new EventEmitter();
  @Input() treatedRequestId: number;
  showOrderbyDropdown: boolean = false;

  constructor(
    private testCaseChangeRequestService: TestCaseChangeRequestService,
    private testCaseChangesService: TestCaseChangesService,
    private globals: Globals) { }

  ngOnInit(): void {
    this.getTestCaseChangeRequestListByProductId();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.treatedRequestId.currentValue != undefined) {
      const index = this.testCaseChangeRequestList.findIndex(testCaseChangeRequest => testCaseChangeRequest.id === changes.treatedRequestId.currentValue);
      if (index !== -1) {
        this.testCaseChangeRequestList.splice(index, 1);
      }
      this.selectedRequest.emit(undefined);
    }
  }
  private getTestCaseChangeRequestListByProductId() {
    this.testCaseChangeRequestService.getTestCaseChangeRequestListByProductId(+this.globals.getProductId()).subscribe(
      testCaseChangeRequestList => {
        this.testCaseChangeRequestList = testCaseChangeRequestList;
      },
      err => { console.log(err); }
    );
  }

  public toggleChangeRequestList() {
    this.showChangeRequestList = !this.showChangeRequestList;
  }

  public selectTestCaseChangeRequest(testCaseChangeRequest: TestCaseChangeRequest) {
    this.selectedTestCaseChangeRequestId = testCaseChangeRequest.id;
    const testCaseChanges = new TestCaseChanges(testCaseChangeRequest.testCaseId, testCaseChangeRequest.testId, testCaseChangeRequest.id)
    this.testCaseChangesService.addTestCaseChanges(testCaseChanges).subscribe(
      addTestCaseChangesResponse => {
        this.selectedRequest.emit(testCaseChangeRequest);
      },
      err => { console.log(err); }
    );
  }

  public getChatUrl(id: number) {
    return this.globals.getChatUrl(id, 'test_case_change_request');
  }

  public toggleOrderbyDropdown() {
    this.showOrderbyDropdown = !this.showOrderbyDropdown;
  }
}
