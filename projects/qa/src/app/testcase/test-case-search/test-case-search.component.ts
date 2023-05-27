import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { TestCaseLibrary } from '../../models/test-case-library';

@Component({
  selector: 'app-test-case-search',
  templateUrl: './test-case-search.component.html',
  styleUrls: ['./test-case-search.component.css']
})
export class TestCaseSearchComponent {
  @Input() selectedPath: string;
  @Input() testCaseLibraryList: TestCaseLibrary[];
  @Output() selectedTestCase = new EventEmitter();


  public openTestCaseForm(testCase: TestCaseLibrary) {
    this.selectedTestCase.emit(testCase);
  }


}
