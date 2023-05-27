import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import * as fields from './user-story.fields';
import { AgileService } from './agile.service';
@Injectable({
  providedIn: 'root'
})
export class UserStoryGrapgQlService extends AgileService {

  constructor(protected injector: Injector) {
    super(injector);
    // Create GraphQL client
    this.createClient();
}

  // QUERIES ------------------------------------------------------------------------------------------------- 

  /**
  * Method used to retrieve the list of user stories by SearchUserStoryInput
  * @param SearchUserStoryInput the given sprint to retrieve user stories 
  */
  public searchUserStories(data: any): Observable<any> {
    return this.request(this.clientName,
      `query searchUserStories($input: SearchUserStoryInput!){
        searchUserStories(input: $input)${fields.userStories}
        }`
      , {
        input: data
      }
    );
  };

}
