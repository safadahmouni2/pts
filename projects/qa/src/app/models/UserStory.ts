import { TestCase } from './TestCase';

export class UserStory {

  progress: string;
  benefit: string;
  acceptanceCriteria: string;
  userPhoto: string;
  state: string;
  user_code: string;
  sprintName: string;
  ts_insert: string;
  urgency: string;
  storyPoints: number;
  id: number;
  first_name: string;
  goal_desire: string;
  description: string;
  role: string;
  topicName: string;
  text: string;
  comments_count: string;
  responsible: string;
  ts_update: string;
  productId: number;
  product: string;
  project: string;
  sprintId: number;
  stateId: number;
  attachments_count: string;
  last_name: string;
  topicId: string;
  urgencyIcon: string;
  testCases?: TestCase[];
}
