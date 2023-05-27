import { MessageDto } from "./messageDto";
import { SectionDto } from "./section-dto";

export class SectionMessage {
    id:number;
    messageDto:MessageDto;
    sectionDto:SectionDto;
    order:number;

}
