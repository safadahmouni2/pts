import { MeetingAttendee } from "./meeting-attendee.model";
import { MeetingParentTypeEnum } from "./meeting-parent-type-enum.model";
import { MeetingRecurrenceTypeEnum } from "./meeting-recurrence-type-enum.model";
import { MeetingTypeEnum } from "./meeting-type-enum.model";

export class MeetingConfig {
    id: number;
    productId:number;
    ticketId:number;
    parentTicketId: number;
    meetName:string;
    startDate:Date;
    endDate:Date;
    meetStartTime:string;
    appMeetStartTime: Date;
    meetDuration:number;
    recurrenceNumber:number;
    organizerCode:string;
    organizerId:number;
    location:string;
    recurrenceType :MeetingRecurrenceTypeEnum;
    parentType :MeetingParentTypeEnum;
    meetType :MeetingTypeEnum;  
    attendees :Array<MeetingAttendee>    
}
