import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TestCaseHistory } from '../../models/TestCaseHistory';
import { TestCaseHistoryService } from '../../services/TestCaseHistoryService';

@Component({
  selector: 'app-test-case-history-list',
  templateUrl: './test-case-history-list.component.html',
  styleUrls: ['./test-case-history-list.component.css']
})
export class TestCaseHistoryListComponent implements OnChanges, OnDestroy {

  constructor(private testCaseHistoryService: TestCaseHistoryService) { }
  @Input() testCaseId: number;
  @Input() newTestCaseArchived: boolean;
  destroy$ = new Subject<void>();
  testCaseHistoryList: TestCaseHistory[];

  ngOnChanges(): void {
    this.testCaseHistoryService.getTestCaseHistoryListByTestCaseId(this.testCaseId).pipe(takeUntil(this.destroy$)).subscribe(
      (data) => {
        if (data) {
          this.testCaseHistoryList = data.sort((a, b) => a.testCaseVersion < b.testCaseVersion ? 1 : -1);
        }
      });
  }

  public getTestCaseHistoryTitle(testCaseHistory: TestCaseHistory): string {
    return `TC${testCaseHistory.testCaseLibraryId}-V${testCaseHistory.testCaseVersion}-${testCaseHistory.creator} (${testCaseHistory.date.split('T')[0]})`;
  }

  ngOnDestroy(): void {
    // Unsubscribe from all observables and complete destroy subject
    this.destroy$.next();
    this.destroy$.complete();
  }

}
