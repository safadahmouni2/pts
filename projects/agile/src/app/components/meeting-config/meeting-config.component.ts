import { Component, Input, OnInit } from '@angular/core';
import { MeetingConfigGraphQlService } from '../../services/pts-api/agile/meeting-config.service';
import { Subject, takeUntil } from 'rxjs';
import { MeetingConfig } from '../../models/meeting-config.model';
import * as moment from 'moment';
import { MeetingTypeEnum } from '../../models/meeting-type-enum.model';
import { MeetingRecurrenceTypeEnum } from '../../models/meeting-recurrence-type-enum.model';
import { MeetingParentTypeEnum } from '../../models/meeting-parent-type-enum.model';

@Component({
  selector: 'app-meeting-config',
  templateUrl: './meeting-config.component.html',
  styleUrls: ['./meeting-config.component.css']
})
export class MeetingConfigComponent implements OnInit {
  @Input() sprintTicketId: number;
  @Input() productId: number;
  startTime;
  durationField;
  durationOptions = ['10', '15', '30'];
  showTimePicker = false;
  destroy$ = new Subject();
  meetingConfig: MeetingConfig = new MeetingConfig();
  isStartPickerOkClicked: boolean;
  selectedMeetingType: MeetingTypeEnum | "" = "";
  selectedMeetingParentType: MeetingParentTypeEnum | "" = "";;
  selectedMeetingRecurrenceType: MeetingRecurrenceTypeEnum | "" = "";;
  constructor(private meetingConfigGraphQlService: MeetingConfigGraphQlService) { }
  ngOnInit(): void {

  }
  onShowTimePocker() {
    this.showTimePicker = true;
    this.isStartPickerOkClicked = false;

  }

  onHideTimePocker() {
    this.showTimePicker = false;
  }
  onSubmitStartTime() {
    this.isStartPickerOkClicked = true;
    if (this.meetingConfig.appMeetStartTime) {
      this.showTimePicker = false;
    }
  }

  saveMeetingConfig(): void {
    console.log(this.selectedMeetingType)
    const meetingConfigInput = {
      productId: this.productId,
      parentTicketId: this.sprintTicketId,
      startDate: moment(this.meetingConfig.startDate).format('YYYY-MM-DD'),
      endDate: moment(this.meetingConfig.endDate).format('YYYY-MM-DD'),
      meetStartTime: moment(this.meetingConfig.appMeetStartTime).format('HH:mm:ss'),
      meetName: this.meetingConfig?.meetName,
      organizerCode: this.meetingConfig?.organizerCode,
      organizerId: this.meetingConfig?.organizerId,
      recurrenceType: this.selectedMeetingRecurrenceType,
      parentType: MeetingParentTypeEnum.SPRINT,
      meetType: this.selectedMeetingType,
      meetDuration: this.meetingConfig.meetDuration,
      location: this.meetingConfig.location

    };
    this.meetingConfigGraphQlService.createMeetingConfig(meetingConfigInput)
      .pipe(
        takeUntil(this.destroy$)
      ).subscribe((saveMeetingConfigResponse) => {
        const dataSource = saveMeetingConfigResponse.data.createMeetingConfig;
        console.log("dataSource createMeetingConfig", dataSource)
      });
  }
}
