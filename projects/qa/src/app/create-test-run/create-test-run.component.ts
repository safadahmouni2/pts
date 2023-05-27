import { Component, OnInit, ChangeDetectorRef, HostListener, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from "@angular/common";
import { TestRunServices } from '../services/testRunServices';
import { TestRun } from '../models/TestRun';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { TestRunDTO } from '../models/TestRunDTO';
import { Globals } from '../config/globals';

@Component({
  selector: 'app-create-test-run',
  templateUrl: './create-test-run.component.html',
  styleUrls: ['./create-test-run.component.css']
})
export class CreateTestRunComponent implements OnInit {
  tabModel = 'Predefined';
  searchTestCaseStatus = false;
  stateSelected = 'TEST';
  testRun = new TestRun();
  testRunDTO = new TestRunDTO();
  testRunForm: UntypedFormGroup;
  InstalledId: string;
  envId: string;
  testCaseFilter;
  focusedFIeld = '';
  selectedTestSuiteId: number;

  // Estimated efforts
  totalEstimatedEffort: number;
  receivedTotalEstimatedEffort = 0;
  resetToZero = 0;

  // Toggle test suites list
  public toggleTestSuitesList = false;

  // Resizing test suites configurations and properties
  private initialWidth = 320;
  private panelMinWidth = 100;
  private panelMaxWidth = 1000;
  private initialMousePosition: number;
  private isResizing = false;
  public panelWidth: number = this.initialWidth;

  constructor(
    private activatedRoute: ActivatedRoute,
    private testRunServices: TestRunServices,
    private toastr: ToastrService,
    private router: Router,
    public globals: Globals,
    private cdRef: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) {
    this.testRunForm = new UntypedFormGroup({
      shortDescription: new UntypedFormControl('', [Validators.required]),
      createTestSuite: new UntypedFormControl(false)
    });
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(
      result => {
        this.InstalledId = result.get('install_id');
        this.testRunDTO.installed_id = +this.InstalledId;
        this.testRunDTO.originSprintId = + this.globals.getSprintId();
        this.envId = result.get('envId');
        this.testRunDTO.environmentId = +this.envId;
      });

  }

  public fieldFocus(event, focusedFIeld?): void {
    event.target.parentNode.classList.add('focused');
    if (focusedFIeld) {
      this.focusedFIeld = focusedFIeld;
    }
  }

  public fieldBlur(event): void {

    if (event.target.value === '') {
      event.target.parentNode.classList.remove('focused');
    }
    this.focusedFIeld = '';
  }

  public filterWith(state: string): void {
    this.stateSelected = state;
  }

  public createTestRun(): void {
    if (this.testRunForm.valid) {
      this.testRunDTO.shortDescription = this.testRunForm.value.shortDescription
       if (this.testRunDTO.installed_id !== undefined) {
        this.testRunServices.addTestRun(this.testRunDTO, +this.InstalledId, parseInt(this.globals.getProductId()), this.testRunForm.value.createTestSuite)
        .subscribe(data => {
            this.toastr.success('Test run created successfully');
            this.router.navigate(['product-dashboard']);
          }
        );
      }
    }
  }

  public onSelectTestSuite(testSuiteId: any): void {
    this.stateSelected = '';
    this.selectedTestSuiteId = testSuiteId;
  }

  public detectTotalEstimated(totalEstimatedEffort: number): void {
    this.receivedTotalEstimatedEffort = totalEstimatedEffort;
    this.cdRef.detectChanges();
  }

  /**
   * Toggle the test suites list
   */
  public onToggleTestSuitesList() {
    this.toggleTestSuitesList = !this.toggleTestSuitesList;
  }

  /**
   * When the mouse key down store the position of mouse and the initial width of the panel
   * @event the mouse move event used to get the current mouse position
   */
  public onResizeStart(event) {
    // Stop the execution if the test suites list is toggled
    if (this.toggleTestSuitesList) {
      return;
    }

    // Enable the resize mode
    this.isResizing = true;

    // Initialize the values
    this.initialMousePosition = event.screenX;
    this.initialWidth = this.panelWidth;

    // Disable text selection on body
    this.renderer.addClass(this.document.body, 'resize-enabled');
  }

  /**
   * When the mouse key is moving while the key is down resize the panel based on the mouse position
   * @event the mouse move event used to calculate the new size
   */
  @HostListener('window:mousemove', ['$event'])
  private onResizeResize(event) {
    // Stop the execution if the resize mode is not enable
    if (!this.isResizing) {
      return;
    }

    // Calculate the new width
    this.panelWidth = this.initialWidth + (event.screenX - this.initialMousePosition);

    // Limit the minimum and the maximum widths
    if (this.panelWidth < this.panelMinWidth) {
      this.panelWidth = this.panelMinWidth;
    }

    if (this.panelWidth > this.panelMaxWidth) {
      this.panelWidth = this.panelMaxWidth;
    }
  }

  /**
   * When the mouse key is up stop the resizing
   */
  @HostListener('window:mouseup')
  private onResizeEnd() {
    // Disable the resize mode
    this.isResizing = false;

    // Re-enable text selection on body
    this.renderer.removeClass(this.document.body, 'resize-enabled');
  }
}
