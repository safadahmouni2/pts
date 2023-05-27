import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AgileService } from './agile.service';
import * as fields from './default-topic.fields';
@Injectable({
  providedIn: 'root'
})
export class DefaultTopicGrapgQlService extends AgileService{

  constructor(protected injector: Injector) {
    super(injector);
    this.createClient();
}
 //  -----------------------------------------QUERIES-------------------------------------------------------- 

    /**
     * Get defaultTopic by topic id
     * @param topicId the given topicId to check default project
     */
    public isDefaultTopic(topicId: number): Observable<any> {
      return this.request(this.clientName,
          `query isDefaultTopic($topicId: Long!){
            isDefaultTopic(topicId: $topicId)
          }`
          , {
            topicId
          }
      );
  };

     /**
     * the given productId to retrieve topicId from default-topic table
     * @param productId the given productId to get defaultTopic 
     */
     public getDefaultTopicByProductId(productId: number): Observable<any> {
      return this.request(this.clientName,
          `query getDefaultTopicByProductId($productId: Long!){
            getDefaultTopicByProductId(productId: $productId)${fields.defaultTopic}
          }`
          , {
            productId
          }
      );
  };
//---------------------------------------- MUTATIONS ------------------------------------------------------------
    /**
     * Method used to create DefaultTopic
     * @param data data of DefaultTopic to be created
     */
    public createDefaultTopic(data: any): Observable<any> {
      return this.request(
          this.clientName,
          `mutation createDefaultTopic($input: DefaultTopicInput!) {
            createDefaultTopic(input: $input) ${fields.defaultTopic}
          }`, {
          input: data
      }
      );
  };

    /**
     * Method used to delete DefaultTopic by productId
     * @param productId 
     */
    public deleteDefaultTopic(productId: number): Observable<any> {
      return this.request(
          this.clientName,
          `mutation deleteDefaultTopic($productId: Long!) {
            deleteDefaultTopic(productId: $productId) 
          }`,{
            productId
        }
      );
  };
}
