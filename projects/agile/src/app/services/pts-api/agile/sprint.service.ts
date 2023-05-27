import { Injectable, Injector } from '@angular/core';
import { BaseGraphQLService } from '../../base-graphql/base-graphql.service';
import { Observable } from 'rxjs';
import * as fields from './sprint.fields';
import { AgileService } from './agile.service';
@Injectable({
  providedIn: 'root'
})
export class SprintGrapgQlService extends AgileService {
  
  constructor(protected injector: Injector) {
      super(injector);
      // Create GraphQL client
      this.createClient();
  }


  // QUERIES ------------------------------------------------------------------------------------------------- 

    /**
     * Get sprints by product id
     * @param productId the given product to filter Sprints
     */
    public getSprintsByProductId(productId: number): Observable<any> {
      return this.request(this.clientName,
          `query getSprintsByProductId($productId: Long!){
            getSprintsByProductId(productId: $productId)${fields.sprints}
          }`
          , {
              productId
          }
      );
  };

  
    /**
     * Get sprint details by  id
     * @param id the given product to get sprint details by id
     */
    public getSprintDetailsById(id: number): Observable<any> {
      return this.request(this.clientName,
          `query getSprintDetailsById($id: Long!){
            getSprintDetailsById(id: $id)${fields.sprintDetail}
          }`
          , {
              id
          }
      );
  };

  /**
   * Get sprint details by  ticket id
   * @param id the given product to get sprint details by ticket id
   */
  public getSprintDetailsByTicketId(ticketId: number): Observable<any> {
      return this.request(this.clientName,
          `query getSprintDetailsByTicketId($ticketId: Long!){
            getSprintDetailsByTicketId(ticketId: $ticketId)${fields.sprintDetail}
          }`
          , {
            ticketId
          }
      );
  };

  /**
   * Get Us grouped by status with count by sprint id 
   * @param sprintId the given sprintId to get Get Us grouped by status with count
   */
  public getCountUsPerStateBySprint(sprintId: number): Observable<any> {
    return this.request(this.clientName,
        `query getCountUsPerStateBySprint($sprintId: Long!){
          getCountUsPerStateBySprint(sprintId: $sprintId) ${fields.StateCounts}
        }`
        , {
          sprintId
        }
    );
};

  /**
     * Get progress of sprint by sprint id 
     * @param sprintId the given sprintId 
     */

  public getSprintProgress(sprintId: number): Observable<any> {
    return this.request(this.clientName,
      `query getSprintProgress($sprintId: Long!){
        getSprintProgress(sprintId: $sprintId)
        }`
      , {
        sprintId
      }
    );
  }


  // MUTATIONS -----------------------------------------------------------------------------------------------

    /**
     * Create Sprint
     * @param data data of Sprint to be created
     */
    public createSprint(data: any): Observable<any> {
      return this.request(
          this.clientName,
          `mutation createSprint($input: SprintInput!) {
            createSprint(input: $input) ${fields.sprintDetail}
          }`, {
          input: data
      }
      );
  };
  /**
   * Update Sprint
   * @param id the id of tprint to be updated
   * @param data data to be updated
   */
  public updateSprint(id: number, data: any): Observable<any> {
      return this.request(
          this.clientName,
          `mutation updateSprint($id: Long!, $input: SprintUpdateInput!) {
            updateSprint(id: $id, input: $input) ${fields.sprintDetail}
          }`, {
          id,
          input: data
      }
      );
  };

}
