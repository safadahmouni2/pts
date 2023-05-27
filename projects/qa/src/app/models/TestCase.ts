import { TestStep } from './TestStep';
import { Folder } from './Folder';

export class TestCase {

  testCaseId: number;
  shortDescription: string;
  description: string;
  category: string;
  state: string;
  preCondition?: string;
  executionEstimationTime?: number;
  userStoryId?: any;
  testSteps?: TestStep[];
  folder?: Folder;
  sprintId?: number;
}
