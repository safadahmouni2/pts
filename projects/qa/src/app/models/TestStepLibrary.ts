export default class TestStepLibrary {

  id: number;

  stepDescription: string;
  expectedResult: string;
  testStepState: string;
  stepOrder: number;
  testCaseLibraryId: number;

  constructor() {
    this.expectedResult = "";
    this.stepDescription = "";
    this.stepOrder = null;
  }


}
