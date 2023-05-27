export class ProcessModel {
  id: number;
  process_type_id: number;
  USER: string;
  ROLE: any;
  start_at: Date;
  progress: number;
  STATUS: string;
  dead_line: Date;
  department: string;
}
