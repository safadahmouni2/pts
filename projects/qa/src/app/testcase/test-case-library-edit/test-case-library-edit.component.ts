import { Component, OnInit, HostListener, Renderer2, Inject, OnDestroy, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { DOCUMENT } from "@angular/common";
import { ActivatedRoute, Router } from '@angular/router';
import { UserStory } from '../../models/UserStory';
import { Product } from '../../models/Product';
import { TestCaseLibrary } from '../../models/test-case-library';
import { TestCaseLibraryService } from '../../services/test-case-library.service';
import { Subject, Subscription } from 'rxjs';
import { SharedService } from '../../services/shared.service';
import { takeUntil } from 'rxjs/operators';
import { UsTestCaseServices } from '../../services/usTestCaseServices';
import { UsTestCase } from '../../models/UsTestCase';
import { LibraryTestCaseEffort } from '../../models/LibraryTestCaseEffort';
import { LibraryTestCaseEffortService } from '../../services/libraryTestCaseEffortService';
import { SaveEffortDialogService } from '../../services/save-effort-dialog.service';



@Component({
    selector: 'app-test-case-library-edit',
    templateUrl: './test-case-library-edit.component.html',
    styleUrls: ['./test-case-library-edit.component.css'],

})
export class TestCaseLibraryEditComponent implements OnInit, OnDestroy {
    clickEventSubscription: Subscription;
    showLibrary = true;
    userStory: UserStory;
    testCaseClass: number;
    testCaseLibrarySelected: any;
    dataLogged = false;
    testCaseList: UsTestCase[];
    openFolderTCLib: Subscription;
    destroy$ = new Subject<void>();
    productList: Product[];
    sendProductForImportToParent: any;
    showImportComponent: boolean = false;
    selectedProductName: string;
    selectedLibraryObject: any ;
    selectedPath: string;
    testCaseLibrarySearchResult: TestCaseLibrary[];
    showSearch = true;
    testCaseSelectedWithProduct: any

    // Use of subject since the value will change
    // Convert to Observable in html to subscribe the value in the child component
    refreshedTestCase: any;
    refreshedUserStoryTestCases: Subject<any> = new Subject<any>();
    refreshedUserStoryTCs: Subject<any> = new Subject<any>();
    currentProductIdToBeOpened: number;
    currentFolderIdToBeOpened: number;
    userStoryId: number;
    selectedNameFromBreadCrumb: any=[];
    hasTestCase = true;
    libraryTestCaseEffort: LibraryTestCaseEffort;
    startDateTime: Date;
    endDateTime: Date;
    running = false;
  counterStarted =false;
  oldSelect :any;

  startCounter: any;
  duration:any;
  showLibraryTree = true;
    
    // Toggle test suites list
    
    // Resizing test suites configurations and properties
    private initialWidth = 250;
    private panelMinWidth = 100;
    private panelMaxWidth = 945;
    private initialMousePosition: number;
    private isResizing = false;
    public panelWidth: number = this.initialWidth;
    

    constructor(
        private activatedRoute: ActivatedRoute,
        private testCaseLibraryServices: TestCaseLibraryService,
        private sharedService: SharedService,
        private router: Router,
        private cdRef: ChangeDetectorRef,
        private libraryTestCaseEffortService :LibraryTestCaseEffortService,
        private saveEffortDialogService: SaveEffortDialogService,
        @Inject(DOCUMENT) private document: Document,
        private renderer: Renderer2
    ) {

    }


    ngOnInit(): void {

        this.activatedRoute.params.pipe(takeUntil(this.destroy$))
            .subscribe((params) => {
                if (params.userStoryId) {
                    this.userStoryId = params.userStoryId;
                    this.dataLogged = true;
                    if (params.testCaseLibraryId) {
                        this.getTestCaseSelected();
                    }
                }
            }
            );
        // subscribe to detect event of unassign TC
        this.sharedService.getAttachEventState().pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.refreshedUserStoryTestCases.next(undefined);
        });


    }

    ngOnDestroy(): void {
        // Unsubscribe from all observables and complete destroy subject
        this.destroy$.next();
        this.destroy$.complete();
    }
    /**
     * resetProductAndFolder(): reset variable of currentProductId and currentFolderId
     */
    resetProductAndFolder() {
        this.currentProductIdToBeOpened = null;
        this.currentFolderIdToBeOpened = null;
    }

    toggleLibraryNav() {
        this.showLibrary = !this.showLibrary;
    }

    eventFromLibrary(event: any) {
        if (event === 'closeLibrary') {
            this.toggleLibraryNav();
        } if (!event) {
            this.showSearch = false;
        }
    }

    fieldFocus(event) {
        event.target.parentNode.classList.add('focused');
    }

    fieldBlur(event) {
        if (event.target.value === '') {
            event.target.parentNode.classList.remove('focused');
        }
    }


    async  selectTestCase(testCase: any) {
        this.showImportComponent = false;
        if (testCase != null) {
            this.testCaseClass = testCase.testCaseLibraryId;
            this.hasTestCase =true;
            this.testCaseLibrarySelected = testCase;
            this.showSearch = false;
            this.showImportComponent = false;
            this.router.navigate(['/edittestcase', this.userStoryId, testCase.testCaseLibraryId]);
            

        } else {
            this.testCaseClass = null;
            this.hasTestCase = false;
        }
    }

    unselectTestCase(id: number): void {

        if (id === this.testCaseLibrarySelected.testCaseLibraryId) {
            this.hasTestCase = false;
        }
    }

    getTestCaseSelected(): void {      
                    const testCaseId  = parseInt(this.activatedRoute.snapshot.paramMap.get('testCaseLibraryId'));
                    this.testCaseLibraryServices.getTestCaseLibraryById(testCaseId).pipe(takeUntil(this.destroy$)).subscribe(
                        (data) => {
                            this.hasTestCase = true
                            this.testCaseLibrarySelected = data;
                            this.hasTestCase =true;
                            this.testCaseClass = data ?.testCaseLibraryId;
                            this.dataLogged = true;
                            this.cdRef.detectChanges();
                        }
                    );
                
                }

    /**
     * Refresh selected folder test cases
     */
    async refreshLibraryList(event) {
        this.refreshedTestCase = event;
        this.testCaseSelectedWithProduct =  Object.assign(this.refreshedTestCase,this.selectedLibraryObject.product)
        this.refreshedUserStoryTestCases.next(event);
    }

    /**
     * openFolderWhenTestCAseAdded
     */
    openFolderWhenTestCAseAdded(event) {
        // this.refreshedTestCase.next(event);
        this.refreshedUserStoryTestCases.next(event);
    }


    /**
     *  openFolderTC
     */
    openFolderTC(event) {
        // this.refreshedTestCase.next(event);
        this.refreshedUserStoryTestCases.next(event);
    }

    getSelectedFolderForImportFromLibrary(event: any) {
        if (event) {
            this.showImportComponent = !event.showTc;
            this.sendProductForImportToParent = event;
        }
    }


   public detectSelectedObject(selectedLibraryObject: any) : void {

       if(this.selectedLibraryObject) this.oldSelect = this.selectedLibraryObject;

        this.selectedLibraryObject = selectedLibraryObject;
        this.showImportComponent = false;
        switch (this.selectedLibraryObject.nodeType) {
            case 'TEST_CASE':
                this.selectedPath = this.selectedLibraryObject.testCase.folder.folderPath;
                this.cdRef.detectChanges();
                this.showSearch = false;
                this.selectedLibraryObject.testCase.shortDescription = this.selectedLibraryObject.label
                this.selectTestCase(this.selectedLibraryObject.testCase);
                break;
            case 'FOLDER':
                this.selectedPath = this.selectedLibraryObject.folderData.folderPath;
                this.hasTestCase = false;
                this.showSearch = true;
                break;
            case 'PRODUCT':     
                this.selectedPath = "/" + this.selectedLibraryObject.product.product_name;
                this.hasTestCase = false;
                this.showSearch = true;
                break;

        }
        this.cdRef.detectChanges();
    }


    async  getSearchResult(searchResult: TestCaseLibrary[]) {
        const testCaseLibrarySelected = this.oldSelect ?this.oldSelect.testCase: this.testCaseLibrarySelected ;
         const oldSelect = this.oldSelect ? this.oldSelect : this.selectedLibraryObject
        this.showSearch = true;
        this.testCaseLibrarySearchResult = searchResult;
        this.showImportComponent = false;
        this.hasTestCase = false;
        if(oldSelect.nodeType === "TEST_CASE" && this.running){
            this.getDuration();
                    const confirmed =  await  this.saveEffortDialogService.confirm(
                    'Library Test Case',
                    'the elapsed effort on the TC '+ this.testCaseLibrarySelected.testCaseLibraryId +' will be saved automatically on closing this alert' 
                    +' You can adjust your effort manually before the timeout',
                        this.testCaseLibrarySelected.testCaseLibraryId,
                        this.testCaseLibrarySelected.shortDescription,
                        this.libraryTestCaseEffort
                      )
                        if (!confirmed) {
                          return ;
                        } else {
                          this.libraryTestCaseEffortService.editLibraryTestCaseEffort(confirmed.id, confirmed).subscribe(
                            editLibraryTestCaseEffortResponse => {
                              // component.reset();
                              this.running = false;
                            });
                        }
                    }
                    
}

    public showSearchResult(event) {
        this.showSearch = event;
        this.showImportComponent = false;
        this.hasTestCase = false;
    }
    initNodeHandle($event) {
        if(this.testCaseLibrarySelected)
         this.testCaseSelectedWithProduct = Object.assign(this.testCaseLibrarySelected, $event.product);
    }
    selectedNameFromBreadcrumb($event){
        this.showSearch =true;
        this.showImportComponent =false ;
        this.hasTestCase = false;

        this.selectedNameFromBreadCrumb= $event;
    }

    getDuration() {
        
        this.endDateTime = new Date();
        const endTime = this.endDateTime.getHours() +
          ':' + ('0' + (this.endDateTime.getMinutes())).slice(-2) +
          ':' + ('0' + this.endDateTime.getSeconds()).slice(-2);
        this.libraryTestCaseEffort.endTime = endTime;
        const durationEnMs = Math.max(this.endDateTime.getTime() - this.startDateTime.getTime(), 0);
        this.libraryTestCaseEffort.effortByLine = Math.floor(durationEnMs / (1000 * 60 * 60)) +
          ':' + Math.floor(durationEnMs / (1000 * 60)) % 60 +
          ':' + Math.floor(durationEnMs / 1000) % 60;
    
        const hours = Math.floor(durationEnMs / (1000 * 60 * 60));
        const minutes = Math.floor(durationEnMs / (1000 * 60)) % 60;
        const seconds = Math.floor(durationEnMs / 1000) % 60;
        this.libraryTestCaseEffort.effortByLine = `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    
        }


    startRunningEvent(event) {
        this.running = event.startRunning;
        if(event.startDateTime){
            this.startDateTime =  event.startDateTime; 
        }else{
            this.startDateTime = new Date();

        }
        const libraryTestCaseEffort = new LibraryTestCaseEffort();
        libraryTestCaseEffort.effortByLine = null;
        libraryTestCaseEffort.testCaseLibraryId = this.testCaseLibrarySelected.testCaseLibraryId;

        const date = this.startDateTime.getFullYear()
            + '-' + ('0' + (this.startDateTime.getMonth() + 1)).slice(-2)
            + '-' + ('0' + this.startDateTime.getDate()).slice(-2);
        libraryTestCaseEffort.date = date;
        const startTime = this.startDateTime.getHours() +
            ':' + ('0' + (this.startDateTime.getMinutes())).slice(-2) +
            ':' + ('0' + this.startDateTime.getSeconds()).slice(-2);
        libraryTestCaseEffort.startTime = startTime;
        libraryTestCaseEffort.endTime = null;
        if(event.id){
            libraryTestCaseEffort.id = event.id;
        }
        this.libraryTestCaseEffort = libraryTestCaseEffort;
    }

      /**
   * When the mouse key down store the position of mouse and the initial width of the panel
   * @event the mouse move event used to get the current mouse position
   */
    public onResizeStart(event) {
        // Stop the execution if the test suites list is toggled
        if (!this.showLibraryTree) {
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

    onShowLibraryTreeChange (value: boolean) {
        this.showLibraryTree = value;
    }
}
