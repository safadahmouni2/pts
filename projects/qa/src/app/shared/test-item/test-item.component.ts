import { Component, Input, OnInit } from '@angular/core';
import { Globals } from '../../config/globals';
import { environment } from '../../../environments/environment';
import { Test } from '../../models/Test';

@Component({
  selector: 'app-test-item',
  templateUrl: './test-item.component.html',
  styleUrls: ['./test-item.component.css']
})
export class TestItemComponent implements OnInit {
  @Input() test: Test;
  chatUrl: string;
  isProd = environment.production;
  constructor(private globals: Globals) { }

  ngOnInit() {
    this.chatUrl = this.globals.getChatUrl(this.test.testId, 'test');
  }

  getTitle() {

    const testCaseLibrary = this.test.testCaseLibraryId ? this.test.testCaseLibraryId :"?"

    if (this.test.userStoryId !== 0) {
      return `T${this.test.testId}-U${this.test.userStoryId}-L${testCaseLibrary}-V${this.test.testCaseVersion}`;
    } else {
      return `T${this.test.testId}-L${testCaseLibrary}-V${this.test.testCaseVersion}`;
    }
  }

}
