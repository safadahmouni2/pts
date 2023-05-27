import { Folder } from './Folder';
import { UsTestStep } from './UsTestStep';

export class UsTestCase {


  usTestCaseId: number;
  shortDescription: string;
  description: string;
  category: string;
  state: string;
  preCondition?: string;
  effort?: string;
  executionEstimationTime?: string;
  userStoryId?: any;
  testCaseLibraryId: any;
  testSteps?: UsTestStep[];
  folder?: Folder;
  sprintId?: number;
  testCaseVersion: number;
  totalTestResult: number;
  testResult?: any[];
}
