import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Test } from '../../models/Test';
import { TestServices } from '../../services/testServices';
import { Globals } from '../../config/globals';

@Component({
    selector: 'app-test-cases-list',
    templateUrl: './test-cases-list.component.html',
    styleUrls: ['./test-cases-list.component.css']
})
export class TestCasesListComponent implements OnInit {
    testCasesListConfig: PerfectScrollbarConfigInterface = {
        useBothWheelAxes: true
    };
    @Input() selectedTestId: number;
    @Input() tests: Test[];
    @Input() testRunStatus: string;
    @Input() counterRunning: boolean;
    @Output() sendTestToParent = new EventEmitter();
    test: Test;
    modalRef: BsModalRef;
    @Output() changeUserStoryId = new EventEmitter();
    @Output() newItemEvent = new EventEmitter();

    constructor(
        private testServices: TestServices, public globals: Globals,
        private modalService: BsModalService, private cdRef: ChangeDetectorRef) {
    }

    ngOnInit() {
        if (this.tests != null) {
            this.sendTestToParent.emit(this.tests[0]);
            this.selectTest(this.tests[0]);
        }
    }

    public switchTestCaseState(test: Test, event: any): void {
        const newTest = new Test();
        const index = this.tests.indexOf(test);
        this.selectTest(test);
        switch (event.target.parentElement.classList.value) {
            case 'switcher switcher-null':
                newTest.testState = 'OK';
                break;
            case 'switcher switcher-true':
                newTest.testState = 'NOT_OK';
                break;
            default:
                newTest.testState = null;
                break;
        }
        this.testServices.editTestState(test.testId, newTest).subscribe(
            data => {
                this.tests[index].testState = newTest.testState;
                if (this.tests[index] === this.test) {
                    this.sendTestToParent.emit(this.tests[index]);
                }
            });
    }

    public selectTest(test: Test): void {
        if (test != null && this.test?.testId !== test?.testId) {
            this.test = test;
            this.sendTestToParent.emit(test);
            this.changeUserStoryId.emit(test.userStoryId);
        }
    }

    public onClickOpenModal(template: TemplateRef<any>, test: Test): void {
        this.modalRef = this.modalService.show(template);
        this.test = test;
    }

    public detectNewItem(newItem): void {
        this.newItemEvent.emit(newItem);
        this.cdRef.detectChanges();
    }
}
