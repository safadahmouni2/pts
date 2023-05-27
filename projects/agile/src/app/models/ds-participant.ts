import { DailyScrum } from "./daily-scrum.model";

export class DsParticipant {
    id:number;
    stateId:number;
    userId:number;
    userCode:string;
    dailyScrum:DailyScrum;
    ticketId:number;
}
