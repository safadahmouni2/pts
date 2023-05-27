import { Feature } from "./feature.model";
import { Sprint } from "./sprint.model";
import { Topic } from "./topic.model";

export class UserStory {
    id: number;
    text: string;
    description: string;
    acceptanceCriteria: string;
   /**new fields from PTS AGILE */
    ticketId: number;
    usId:number;
    testRunID:number;
    testStepID:number;
    testId:number;
    parentTicketId:number;
    urgencyId:number;
    orderByDs:number;
    orderByTopic:number;
    shortDescription:string;
    _shortDescription:string;
    longDescription:string;
    role:string;
    goal:string;
    benefit:string;
    project:string;
    responsibleId:number;
    topic:Topic;
    sprint:Sprint;
    feature:Feature;
    userCode:string;
/**new fields from PTS AGILE */
    topicId: number;
    topicName: string;
    sprintId: number;
    sprintName: string;
    springShortName: string;
    featureId: number;
    responsible: string;
    stateId: number;
    state: string;
    storyPoints: number;
    urgencyIcon: string;
    urgency: string;
    progress: number;
    order: number;
    editMode: boolean = false;
    expanded: boolean = false;
    commentsExpanded: boolean = false;
    addCommentMode: boolean = false;
    _text: string;
    projectName: string;
    productId: number;
    productName: number;
    chat_url: string;
    assignedTasketsNumber: number;
    is_changed: number;
    userPhoto;
 
    constructor() {
    }

    toggleEditMode(): void {
        this._shortDescription = this.shortDescription;
        this.editMode = !this.editMode;
    }
    toggleExpand(): void {
        this.expanded = !this.expanded;
    }

    toggleAddCommentMode(): void {
        this.addCommentMode = !this.addCommentMode;
    }

    addComment(): void {
        this.addCommentMode = true;
        this.commentsExpanded = true;
        this.expanded = true;
    }
}
