export class TestStep {

  constructor() {
    this.stepDescription = "";
    this.expectedResult = "";
  }

  id: number;
  stepDescription: string;
  expectedResult: string;
  testStepState: string;
  stepOrder: number;
  usTestCaseId: number;
  testId: number;
  testStepLibraryId: number;
  testCaseLibraryId: number;
}

