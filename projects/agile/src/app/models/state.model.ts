import {UserStory} from './user-story.model';

export class State {
  stateId: number;
  stateName: string;
  userStories: UserStory[] = [];
 }
