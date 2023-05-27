import { TestCase } from './TestCase';
import { TestStep } from './TestStep';

export class Test extends TestCase {

  constructor() {
    super();
  }

  testId: number;
  testState: string;
  testCaseVersion: number;
  testCaseLibraryId: number;
  userStoryId: number;
  originSprintId: number;
  testSteps: TestStep[];
  testRunId: number;
  environmentId: number;
  modifier: string;
  creator: string;
  created: string;
  modified: string;
  totalTestResult:number;

}
