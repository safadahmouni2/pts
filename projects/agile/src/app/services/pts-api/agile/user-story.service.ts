import { Injectable, Injector } from '@angular/core';
import { AgileService } from './agile.service';
import { Observable } from 'rxjs';
import * as fields from './user-story.fields';
@Injectable({
  providedIn: 'root'
})
export class UserStoryGrapgQlService extends AgileService{

  constructor(protected injector: Injector) {
    super(injector);
    // Create GraphQL client
    this.createClient();
}

  // QUERIES ------------------------------------------------------------------------------------------------- 

    /**
     * Get User Story MaxOrder by topic id
     * @param topicId the given topic to filter User Stories
     */
    public getUserStoryMaxOrder(topicId: number): Observable<any> {
      return this.request(this.clientName,
          `query getUserStoryMaxOrder($topicId: Long!){
            getUserStoryMaxOrder(topicId: $topicId)
          }`
          , {
            topicId
          }
      );
  };

  //---------------------------------------- QUERIES ------------------------------------------------------------
    /**
     * Method used to retrieve the list of US by topicId
     * @param topicId the given topic to retrieve US
     */
    public getUserStoriesByTopicId(topicId: number): Observable<any> {
      return this.request(this.clientName,
          `query getUserStoriesByTopicId($topicId: Long!){
            getUserStoriesByTopicId(topicId: $topicId)${fields.userStories}
        }`
          , {
            topicId
          }
      );
  };

   /**
     * Method used to retrieve the list of US by featureId
     * @param featureId the given feature to retrieve US
     */
   public getUserStoriesByFeatureId (featureId: number): Observable<any> {
    return this.request(this.clientName,
        `query getUserStoriesByFeatureId ($featureId: Long!){
          getUserStoriesByFeatureId (featureId: $featureId)${fields.userStories}
      }`
        , {
          featureId
        }
    );
};
   /**
     * Method used to retrieve the list of US by productId
     * @param productId the given product to retrieve US
     */
   public getUserStoriesByProductIdWithoutFeature(productId: number): Observable<any> {
    return this.request(this.clientName,
        `query getUserStoriesByProductIdWithoutFeature($productId: Long!){
          getUserStoriesByProductIdWithoutFeature(productId: $productId)${fields.userStories}
      }`
        , {
          productId
        }
    );
};
  /**
     * Method used to retrieve the list of US by productId
     * @param productId the given product to retrieve US
     */
  public getUserStoriesByProductIdWithoutTopic(productId: number): Observable<any> {
    return this.request(this.clientName,
      `query getUserStoriesByProductIdWithoutTopic($productId: Long!){
        getUserStoriesByProductIdWithoutTopic(productId: $productId)${fields.userStories}
      }`
      , {
        productId
      }
    );
  };

  /**
   * Method used to retrieve the list of US by productId
   * @param productId the given product to retrieve US
   */
  public getUserStoriesByProductIdWithoutSprint(productId: number): Observable<any> {
    return this.request(this.clientName,
      `query getUserStoriesByProductIdWithoutSprint($productId: Long!){
        getUserStoriesByProductIdWithoutSprint(productId: $productId)${fields.userStories}
        }`
      , {
        productId
      }
    );
  };
// MUTATIONS -----------------------------------------------------------------------------------------------

    /**
     * Create User Story
     * @param data data of User Story to be created
     */
    public createUserStory(data: any): Observable<any> {
      return this.request(
          this.clientName,
          `mutation createUserStory($input: UserStoryInput!) {
            createUserStory(input: $input) ${fields.userStory}
          }`, {
              input: data
          }
      );
  };

      /**
     * update User Story
     * @param data data of User Story to be updated
     */
    public updateUserStory(id:any, data: any): Observable<any> {
      return this.request(
          this.clientName,
          `mutation updateUserStory($id: Long!,$input: UserStoryUpdateInput!) {
            updateUserStory(id:$id, input: $input) ${fields.userStory}
          }`, {
              id,
              input: data
          }
      );
  };

      /**
     * Method used to retrieve the list of user stories by sprintId
     * @param sprintId the given sprint to retrieve user stories 
     */
    public getUserStoriesBySprintId(sprintId: number): Observable<any> {
      return this.request(this.clientName,
          `query getUserStoriesBySprintId($sprintId: Long!){
            getUserStoriesBySprintId(sprintId: $sprintId)${fields.userStories}
        }`
          , {
            sprintId
          }
      );
  };

  
      /**
     * Method used to retrieve the user story details by id
     * @param id the given user story  to retrieve details
     */
    public getUserStoryDetails(id: number): Observable<any> {
      return this.request(this.clientName,
          `query getUserStoryDetails($id: Long!){
            getUserStoryDetails(id: $id)${fields.userStory}
        }`
          , {
            id
          }
      );
  };
}
