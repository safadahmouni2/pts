import { Injectable, Injector } from '@angular/core';

import * as fields from './daily-scrum.fields';
import { Observable } from 'rxjs';
import { AgileService } from './agile.service';

@Injectable({
    providedIn: 'root'
})
export class DailyScrumGrapgQlService extends AgileService {

    constructor(protected injector: Injector) {
        super(injector);
        // Create GraphQL client
        this.createClient();
    }

    // QUERIES ------------------------------------------------------------------------------------------------- 
   
    /**
     * Get started daily scrum by sprint id
     * @param sprintId the given sprintId to filter daily scrums
     */
    public startedDailyScrumBySprintId(sprintId: number): Observable<any> {
        return this.request(this.clientName,
            `query startedDailyScrumBySprintId($sprintId: Long!){
                startedDailyScrumBySprintId(sprintId: $sprintId),${fields.dailyScrum}
            }`
            , {
                sprintId
            }
        );
    };

    /**
     * Get started daily scrum by sprint id
     * @param sprintId the given sprintId to filter daily scrums
     */
    public myDailyScrums(productIds: Array<number>): Observable<any> {
        return this.request(this.clientName,
            `query myDailyScrums($productIds: [Long!]!){
                myDailyScrums(productIds: $productIds),${fields.myDailyScrums}
            }`
            , {
                productIds
            }
        );
    };

    // MUTATIONS -----------------------------------------------------------------------------------------------

    /**
     * Create DailyScrum
     * @param data data of DailyScrum to be created
     */
    public createDailyScrum(data: any): Observable<any> {
        return this.request(
            this.clientName,
            `mutation createDailyScrum($input: DailyScrumInput!) {
                createDailyScrum(input: $input) ${fields.dailyScrum}
            }`, {
                input: data
            }
        );
    };

    /**
     * Update DailyScrum
     * @param id the id of daily scrum to be updated
     * @param data data to be updated
     */
    public updateDailyScrum(id: number ,data: any): Observable<any> {
        return this.request(
            this.clientName,
            `mutation updateDailyScrum($id: Long!, $input: DailyScrumUpdateInput!) {
                updateDailyScrum(id:$id, input: $input) ${fields.dailyScrum}
            }`, {
                id: id,
                input: data
            }
        );
    };    

}
