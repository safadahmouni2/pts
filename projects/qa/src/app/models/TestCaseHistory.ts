import { TestStep } from './TestStep';
import { Folder } from './Folder';

export class TestCaseHistory {

    id: number;
    testCaseLibraryId: number;
    date: string;
    shortDescription: string;
    description: string;
    category: string;
    preCondition: string;
    effort: string;
    executionEstimationTime: string;
    testStepsLibraryHistory: TestStep[];
    folder: Folder;
    productId: number;
    testCaseVersion: number;
    creator: string;

}
