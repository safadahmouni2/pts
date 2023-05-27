import { TestStep } from "./TestStep";

export class TestCaseChanges {
    id?: number;
    creator: string;
    created: Date;
    modifier: string;
    modified: Date;
    version: number;
    testCaseChangeRequestId: number;
    testId: number;
    testCaseLibraryId: number;

    shortDescription: string;
    description: string;
    category: string;
    preCondition: string;
    executionEstimationTime: number;
    testStepChanges: TestStep[];

    constructor(testCaseLibraryId: number, testId: number, testCaseChangeRequestId: number) {
        this.testCaseLibraryId = testCaseLibraryId;
        this.testId = testId;
        this.testCaseChangeRequestId = testCaseChangeRequestId;
    }

}








