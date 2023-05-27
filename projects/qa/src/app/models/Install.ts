import { TestRun } from './TestRun';
export class UserStoryObj {
  userStoryId?: number;
  userStoryName?: string;
}
export class Install {

  installId: number;
  description: string;
  date: Date;
  state: string;
  envId: number;
  productId: number;
  urgency: string;
  installVersion: string;
  requestedRelease: string;
  testRuns: TestRun[];

  msg: string;
  environment: string;
  status_id: number;
  installed_release: number;
  install_id: number;
  rel_name: string;
  requested_release: string;
  project: string;
  deadline: Date;
  targetSprintId: number;
  userStoryId: number;
}
