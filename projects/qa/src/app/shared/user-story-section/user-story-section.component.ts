import { Component, Input } from '@angular/core';
import { TestCaseServices } from '../../services/testCaseServices';
import { UserStory } from '../../models/UserStory';
import { TestCase } from '../../models/TestCase';

@Component({
  selector: 'app-user-story-section',
  templateUrl: './user-story-section.component.html',
  styleUrls: ['./user-story-section.component.css']
})
export class UserStorySectionComponent {
  @Input() userStoryList: UserStory[];
  @Input() productEnvironments: any;
  public testCaseList: TestCase[];
  public isTestCaseView = false;
  constructor(public testCaseServices: TestCaseServices) { }




  public deleteTestCase(testsByTestCase, id: any): void {
    for (const testAndTestCase of testsByTestCase) {
      if (testAndTestCase.testCase.usTestCaseId === id) {
        const index: number = testsByTestCase.indexOf(testAndTestCase);
        if (index !== -1) {
          testsByTestCase.splice(index, 1);
        }
      }
    }
  }
}
