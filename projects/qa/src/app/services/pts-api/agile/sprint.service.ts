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

}