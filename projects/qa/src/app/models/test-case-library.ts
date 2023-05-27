import { TestStep } from './TestStep';
import { Folder } from './Folder';
import {SourceSystem} from "./SourceSystem";

export class TestCaseLibrary {

    testCaseLibraryId: number;
    shortDescription: string;
    description: string;
    category: string;
    state: string;
    preCondition: string;
    executionEstimationTime: string;
    testStepsLibrary: TestStep[];
    folder: Folder;
    productId: number;
    testCaseVersion: number;
    sourceSystem: SourceSystem;
}
