import { Injectable, Injector } from '@angular/core';
import { AgileService } from './agile.service';
import * as fields from './ds-participant.fields';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DsParticipantGraphQlService extends AgileService{

  constructor(protected injector: Injector) {
    super(injector);
    this.createClient();
}


  //---------------------------------------- MUTATIONS ------------------------------------------------------------
    /**
     * Method used to create DsParticipant
     * @param data data of DsParticipant to be created
     */
    public createDsParticipant(data: any): Observable<any> {
      return this.request(
          this.clientName,
          `mutation createDsParticipant($input: DsParticipantInput!) {
            createDsParticipant(input: $input) ${fields.dsParticipant}
          }`, {
          input: data
      }
      );
  };

    //---------------------------------------- MUTATIONS ------------------------------------------------------------
    /**
     * Method used to update DsParticipant
     * @param data data of DsParticipant to be updated
     */
    public updateDsParticipant( id:number,data: any): Observable<any> {
      return this.request(
          this.clientName,
          `mutation updateDsParticipant($id: Long!,$input: UpdateDsParticipantInput!) {
            updateDsParticipant(id: $id,input: $input) ${fields.dsParticipant}
          }`, {
          id,
          input: data
      }
      );
  }

}
