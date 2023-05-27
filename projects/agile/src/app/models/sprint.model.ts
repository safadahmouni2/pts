import {UserStory} from './user-story.model';
import { StateBySprint } from '../components/dashbord/StateBySprint.model';
export class Sprint {

    name: string;
    state : string;
    stateId: number;
    dsState : string;
    product: string;
    dsStartTime: string;
    appDsStartTime: Date;
    dsEndTime: string;
    sprintStartDate: string;
    sprintEndDate: string;
    startDate: Date;
    endDate: Date;
    progressColor : string;
    sm: string;
    dsDuration: number;
    dsTimer : string;
    sprintId: number;
    progress: number;
    dsEndTimeDone: string;
    dsStartTimeDone: string;
    userStories: UserStory[] = [];
    allStateBySprint: StateBySprint[] = [];
    shortName: string;
    addComment: string;
    project: string;
    parentId: number;
    dsTimerDeadLineReached: boolean;
    chatLinkUrl: string;
	dsMeetingUrl: string;
    id:number;
	parent:number;
    ticketId: number;
    productId: number;
    appDsEndTime: any;
    getSumStoryPoints(): number {
        let sum: number = 0;
        for (const userStory of this.userStories) {
            if (userStory.storyPoints != null) {
                sum += (+userStory.storyPoints);

            }

        }
        return sum;
    }

}
