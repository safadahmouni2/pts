


export class TestCaseChangeRequest {
    id?: number;
    creator: string;
    created: Date;
    modifier: string;
    modified: Date;
    version: number;
    state: string;
    testCaseId: number;
    testId: number;
    productId: number;
    sprintId: number;

    constructor(testCaseId: number, testId: number, productId: number, sprintId: number) {
        this.testId = testId;
        this.testCaseId = testCaseId;
        this.productId = productId;
        this.sprintId = sprintId;
    }

}








