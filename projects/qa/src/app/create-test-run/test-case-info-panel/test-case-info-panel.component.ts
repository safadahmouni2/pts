import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-test-case-info-panel',
  templateUrl: './test-case-info-panel.component.html',
  styleUrls: ['./test-case-info-panel.component.css']
})
export class TestCaseInfoPanelComponent {
  @Output() closePanel = new EventEmitter<void>();
  @Input() testCaseDetails: any;
  @Input() testSteps: any[];

  isBeingClosed = false;

  getTitle() {
    if ('testStepsLibrary' in this.testCaseDetails) {
      return "TC" + this.testCaseDetails.testCaseLibraryId + "-V" + this.testCaseDetails.testCaseVersion;
    } else if ('usTestCaseId' in this.testCaseDetails) {
      return "TC" + this.testCaseDetails.testCaseLibraryId + "-U" + this.testCaseDetails.userStoryId + "-V" + this.testCaseDetails.testCaseVersion;
    }
  }

  /**
   * On click on close button or the backdrop
   * toggle the close animation then emit the closePanel output to the parent component
   */
  public onClosePanel(): void {
    // Toggle the close animation
    this.isBeingClosed = true;

    // Emit the close output after the timing of the animation
    setTimeout(() => {
      this.closePanel.emit();
    }, 500);
  }

}
