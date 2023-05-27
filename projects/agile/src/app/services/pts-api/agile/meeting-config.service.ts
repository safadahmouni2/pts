import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs'; import { AgileService } from './agile.service';
import * as fields from './meeting-config.fields';

@Injectable({
  providedIn: 'root'
})
export class MeetingConfigGraphQlService extends AgileService {

  constructor(protected injector: Injector) {
    super(injector);
    this.createClient();
  }
  //---------------------------------------- MUTATIONS ------------------------------------------------------------
    /**
     * Method used to create MeetingConfig
     * @param data data of MeetingConfig to be created
     */
    
  public createMeetingConfig(data: any): Observable<any> {
    return this.request(
        this.clientName,
        `mutation createMeetingConfig($input: MeetingConfigInput!) {
          createMeetingConfig(input: $input) ${fields.meetingConfig}
        }`, {
            input: data
        }
    );
};
}
