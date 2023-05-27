import { TestDTO } from './TestDTO';

export class TestRunDTO {
    testRunId: number;
    shortDescription: string;
    responsible: string;
    tests: TestDTO[];
    environmentId: number;
    originSprintId: number;
    installed_id: number;
    flag: string;
    creator: string;
    created :Date;
    modified :Date;
    modifier : string;
}
