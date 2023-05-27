import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import * as fields from './sprint-member.fields';
import { AgileService } from './agile.service';

@Injectable({
    providedIn: 'root'
})
export class SprintMemberGraphQlService extends AgileService {

    constructor(protected injector: Injector) {
        super(injector);
        this.createClient();
    }
//---------------------------------------- QUERIES ------------------------------------------------------------
    /**
     * Method used to retrieve the list of sprint members by sprintId
     * @param sprintId the given sprint to retrieve Sprint members
     */
    public filterSprintMembers(data: any): Observable<any> {
        return this.request(this.clientName,
            `query filterSprintMembers($input: SearchSprintMemberInput!){
                filterSprintMembers(input: $input)${fields.sprintMembers}
          }`
            , {
               input: data
            }
        );
    };

//---------------------------------------- MUTATIONS ------------------------------------------------------------
    /**
     * Method used to create SprintMember
     * @param data data of SprintMember to be created
     */
    public createSprintMember(data: any): Observable<any> {
        return this.request(
            this.clientName,
            `mutation createSprintMember($input: SprintMemberInput!) {
              createSprintMember(input: $input) ${fields.sprintMemberDetail}
            }`, {
            input: data
        }
        );
    };

 /**
 * Update sprint member
 * @param id the id of sprint member to be updated
 * @param data data to be updated
 */
    public updateSprintMember(id: number, data: any): Observable<any> {
        return this.request(
            this.clientName,
            `mutation updateSprintMember($id: Long!, $input: SprintMemberInput!) {
                updateSprintMember(id: $id, input: $input) ${fields.sprintMemberDetail}
            }`, {
            id,
            input: data
        }
        );
    };
}
