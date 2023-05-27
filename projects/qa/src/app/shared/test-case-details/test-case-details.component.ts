import { Component, Input } from '@angular/core';
import { TestCaseLibrary } from '../../models/test-case-library';

@Component({
  selector: 'app-test-case-details',
  templateUrl: './test-case-details.component.html',
  styleUrls: ['./test-case-details.component.css'],

})
export class TestCaseDetailsComponent {

  @Input() testCase: TestCaseLibrary;
  @Input() testSteps: any[];


}
