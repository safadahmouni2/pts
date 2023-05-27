import { Component, EventEmitter, Input, OnChanges, Output, TemplateRef, ChangeDetectorRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Test } from '../../models/Test';
import { TestServices } from '../../services/testServices';
import { TestStep } from '../../models/TestStep';
import { TestStepServices } from '../../services/testStepServices';
import { Globals } from '../../config/globals';
import { TicketServices } from '../../services/ticketServices';
import { ProblemServices } from '../../services/problemServices';

import { TestEffortServices } from '../../services/testEffortServices';
import { environment } from '../../../environments/environment';
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { DocumentTestCaseLibraryService } from '../../services/documentTestCaseLibraryService';
import { DocumentTestService } from '../../services/documentTestService';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-test-run-test-case',
    templateUrl: './test-run-test-case.component.html',
    styleUrls: ['./test-run-test-case.component.css']
})
export class TestRunTestCaseComponent implements OnChanges, OnInit, OnDestroy {

    @Input() test: Test;
    @Input() counterRunning: boolean;
    @Input() testRunStatus: string;
    @Output() sendTestToParent = new EventEmitter();
    @Input() tests: Test[];
    @Output() changeUserStoryId = new EventEmitter();
    @Input() newItem;
    @Input() testRunId: number;
    @Output() refreshTotalEffort = new EventEmitter();
    @Output() edited = new EventEmitter();
    modalRef: BsModalRef;
    focusedFIeld = '';
    testCaseStatus = 0;
    selectedIndex: number;
    ticketList: any;
    problemList: any;
    testSteps: any;
    testStepStatusList: any[];
    selectedTestStep: TestStep;
    testEffortList: any;
    totalEffort: any;
    chatUrl: string;
    isProd = environment.production;
    public showEditTestComponent = false;
    destroy$ = new Subject<void>();
    attachmentsModel = 'testAttachments';
    documentList = [];
    inputDocShortDescription = "";
    onUploading = false;
    selectedFile: File;
    isTestAttachment = true;


    constructor(
        private modalService: BsModalService,
        private testServices: TestServices,
        private ticketServices: TicketServices,
        private problemServices: ProblemServices,
        private testStepService: TestStepServices,
        public globals: Globals,
        private cdRef: ChangeDetectorRef,
        private testEffortServices: TestEffortServices,
        public testDocumentService: DocumentTestService,
        public libraryDocumentService: DocumentTestCaseLibraryService,
        private toastr: ToastrService) {
        this.selectedIndex = 0;

    }

    ngOnChanges() {
        this.getAttachments('testAttachments');
        this.getAllAssignedTasksByTestId();
        this.chatUrl = this.globals.getChatUrl(this.test.testId, 'test');
        this.testSteps = this.test.testSteps?.sort((a, b) => a.stepOrder > b.stepOrder ? 1 : -1);
        this.getAllTestEffortsByTestId();
        if (!this.showEditTestComponent) {
            const testId = this.test.testId;
            this.testStepService.getTestStepsByTestId(testId).pipe(takeUntil(this.destroy$)).subscribe(
                (data) => {
                    if (data) {
                        this.testSteps = data.sort((a, b) => a.stepOrder > b.stepOrder ? 1 : -1);
                        this.test.testSteps = this.testSteps;
                    }
                });
        }
    }
    ngOnInit() {
        this.getAllAssignedTasksByTestId();
        this.changeUserStoryId.emit(this.tests[this.selectedIndex].userStoryId);
    }

    @HostListener('window:beforeunload')
    ngOnDestroy() {

        this.destroy$.next();
        this.destroy$.complete();
    }

    fieldFocus(event) {
        event.target.parentNode.classList.add('focused');
    }

    fieldBlur(event) {
        if (event.target.value === '') {
            event.target.parentNode.classList.remove('focused');
        }
    }

    editTestStatus(event) {
        if (event.target.parentElement.classList.contains('switcher-null')) {
            const numberOfTestSteps = (this.testSteps).length;
            let i;
            for (i = 0; i < numberOfTestSteps; i++) {
                if ((this.testSteps[i].testStepState) == null) {
                    this.test.testState = null;
                    break;
                } else if ((this.testSteps[i].testStepState).toUpperCase() === 'NOT_OK') {
                    this.test.testState = 'NOT_OK';
                    break;
                } else {
                    this.test.testState = 'OK';
                }
            }

        } else if (event.target.parentElement.classList.contains('switcher-true')) {
            this.test.testState = 'NOT_OK';
        } else {
            this.test.testState = null;
        }

        this.testServices.editTestState(this.test.testId, this.test).subscribe(
            data => {
                this.sendTestToParent.emit(this.test);
            });
    }

    editTestStepStatus(testStep: TestStep, event: any) {
        const index = this.test.testSteps.indexOf(testStep);
        if (event.target.parentElement.classList.contains('switcher-null')) {
            testStep.testStepState = 'OK';
            this.updateTestStep(testStep, index);
        } else if (event.target.parentElement.classList.contains('switcher-true')) {
            testStep.testStepState = 'NOT_OK';
            this.updateTestStep(testStep, index);

        } else {
            testStep.testStepState = null;
            this.updateTestStep(testStep, index);
        }
        this.editTestStatus(event);
    }

    updateTestStep(testStep, index) {
        this.testStepService.editTestStepState(testStep.id, testStep).subscribe(
            data => {
                this.sendTestToParent.emit(this.test);
                this.test.testSteps[index].testStepState = testStep.testStepState;
            });
    }

    switcherChange() {
        if (this.testCaseStatus < 2) {
            this.testCaseStatus++;
        } else {
            this.testCaseStatus = 0;
        }
    }


    onClickOpenModal(template: TemplateRef<any>, testStep) {
        this.modalRef = this.modalService.show(template);
        this.selectedTestStep = testStep;
    }

    goPrevious() {
        --this.selectedIndex;
        this.test = this.tests[this.selectedIndex];
        this.sendTestToParent.emit(this.test);
        this.testSteps = this.test.testSteps;
        this.changeUserStoryId.emit(this.test.userStoryId);
        this.ngOnDestroy();
        this.ngOnChanges();
        this.ngOnInit();
    }

    goNext() {
        ++this.selectedIndex;
        this.test = this.tests[this.selectedIndex];
        this.sendTestToParent.emit(this.test);
        this.testSteps = this.test.testSteps;
        this.changeUserStoryId.emit(this.test.userStoryId);
        this.ngOnDestroy();
        this.ngOnChanges();
        this.ngOnInit();
    }

    getAllAssignedTasksByTestId() {
        this.ticketServices.getAllTicketByTestId(this.test.testId).subscribe(
            data => {
                this.ticketList = data;
            },
            error => { console.log('An error was occurred.'); },
            () => { console.log('loading ticket list was done in test case view.'); }
        );

        this.problemServices.getAllProblemByTestId(this.test.testId).subscribe(
            data => {
                this.problemList = data;
            },
            error => { console.log('An error was occurred.'); },
            () => { console.log('loading problem list was done in test case view.'); }
        );
    }

    detectNewItem(newItem): void {
        this.getAllAssignedTasksByTestId();
        this.cdRef.detectChanges();
    }


    getAllTestEffortsByTestId() {
        this.testEffortServices.getAllTestEffortByTestId(this.test.testId).subscribe(
            data => {
                this.testEffortList = data;
                this.getTotalEffortByTestId();
            },
            error => { console.log('An error was occurred.'); },
            () => { console.log('loading test effort list was done in test case view.'); }
        );
    }
    getTotalEffortByTestId() {
        this.testEffortServices.getTotalEffortByTestId(this.test.testId).subscribe(
            data => {
                this.totalEffort = data ? data : '00:00:00';
            }
        );
    }
    getTitle() {
        const testCaseLibrary = this.test.testCaseLibraryId ? this.test.testCaseLibraryId : "?"

        if (this.test.userStoryId !== 0) {
            return `T${this.test.testId}-U${this.test.userStoryId}-L${testCaseLibrary}-V${this.test.testCaseVersion}`;
        } else {
            return `T${this.test.testId}-L${testCaseLibrary}-V${this.test.testCaseVersion}`;
        }
    }

    public getTestStepChatUrl(id: number): string {
        return this.globals.getChatUrl(id, 'test_step');
    }


    editTest() {
        this.showEditTestComponent = true;
        this.testServices.sharedShowEdit.next(this.showEditTestComponent);
        this.edited.emit();
    }

    getAttachments(type) {
        if (type === 'testAttachments') {
            this.testDocumentService.getFilesByTest(this.test.testId).subscribe(data => {
                this.documentList = data;
            })
        }
        else {
            this.libraryDocumentService.getFilesByTestCaseLibrary(this.test.testCaseLibraryId).subscribe(data => {
                this.documentList = data;

            })
        }
    }

    onChange(event) {
        this.onUploading = true;
        this.selectedFile = event.target.files[0];
        this.testDocumentService.upload(this.selectedFile, this.test.testId).subscribe(
            (event: any) => {
                this.getDocumentsByTest();
                this.onUploading = false;
            }
        )

    }
    public updateDocShortDescription(doc) {
        this.inputDocShortDescription = "";
        this.testDocumentService.updateTestDoc(doc.id, doc).subscribe(data => { this.toastr.success('Test document updated successfully'); })

    }

    public getInputDocShortDescription(inputDocShortDescription, index) {
        const str = ''
        return str.concat(inputDocShortDescription, index);
    }

    downloadFile(doc: any): void {
        if (this.attachmentsModel === 'testAttachments') {
            this.testDocumentService
                .download(doc.id)
                .subscribe(blob => saveAs(blob, doc.fileName));
        } else {
            this.libraryDocumentService
                .download(doc.id)
                .subscribe(blob => saveAs(blob, doc.fileName));
        }
    }
    editDoc(doc) {
        this.inputDocShortDescription = this.getInputDocShortDescription('docShortDescription', doc.id);

    }
    deleteDoc(doc) {
        this.testDocumentService.deleteDocumentTest(doc.id).subscribe(data => {
            this.getDocumentsByTest();
            this.toastr.success('Test document deleted successfully');

        })
    }
    getDocumentsByTest() {
        this.testDocumentService.getFilesByTest(this.test.testId).subscribe(data => {
            this.documentList = data;
            this.documentList.forEach(doc => {
                if (this.selectedFile && doc.fileName === this.selectedFile.name) {
                    this.inputDocShortDescription = this.getInputDocShortDescription('docShortDescription', doc.id);
                }

            });
            this.cdRef.detectChanges();
        })
    }

    resetChangement(doc) {
        this.inputDocShortDescription = "";
        this.selectedFile = null;
        this.getDocumentsByTest();
    }
}