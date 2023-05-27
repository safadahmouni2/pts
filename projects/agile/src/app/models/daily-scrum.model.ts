
import { DsParticipant } from './ds-participant';
import { Sprint } from './sprint.model';
export class DailyScrum {
    id: number;
    ticketId: number;
    stateId: string;
    startedAt: Date;
    finishedAt: Date;
    sprintProgress: string;
    sprint: Sprint;
    dsParticipants :Array<DsParticipant>    
    creator: string;
    
    constructor() {
    }

}
