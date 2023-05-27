import { Component, Input } from '@angular/core';
import { TestCase } from '../../models/TestCase';

@Component({
  selector: 'app-test-case-container',
  templateUrl: './test-case-container.component.html',
  styleUrls: ['./test-case-container.component.css']
})
export class TestCaseContainerComponent {
  @Input() testCaseList: TestCase[];
  public isTestCaseView = true;


  public deleteTestCase(id: any): void {
    for (const testCase of this.testCaseList) {
      if (testCase.testCaseId === id) {
        const index: number = this.testCaseList.indexOf(testCase);
        if (index !== -1) {
          this.testCaseList.splice(index, 1);
        }
      }
    }
  }

}
