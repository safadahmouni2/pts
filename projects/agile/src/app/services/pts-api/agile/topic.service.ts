import { Injectable, Injector } from '@angular/core';

import * as fields from './topic.fields';
import { Observable } from 'rxjs';
import { AgileService } from './agile.service';

@Injectable({
    providedIn: 'root'
})
export class TopicGrapgQlService extends AgileService {

    constructor(protected injector: Injector) {
        super(injector);
        // Create GraphQL client
        this.createClient();
    }

    // QUERIES ------------------------------------------------------------------------------------------------- 

    /**
     * Get topics by product id
     * @param productId the given product to filter Topics
     */
    public getTopicsByProductId(productId: number): Observable<any> {
        return this.request(this.clientName,
            `query topicsByProductId($productId: Long!){
               topicsByProductId(productId: $productId)${fields.topics}
            }`
            , {
                productId
            }
        );
    };
    /**
     * Get topic by id
     * @param id the given id to get Topics
     */
    public getTopicsById(id: number): Observable<any> {
        return this.request(this.clientName,
            `query getTopic($id: Long!){
                getTopic(id: $id)${fields.topic}
            }`
            , {
                id
            }
        );
    };
    /**
     * get Topic MaxOrder
     * @param productId the given product to filter Topics
     */
    public getTopicMaxOrder(productId: number): Observable<any> {
        return this.request(this.clientName,
            `query getTopicMaxOrderByProduct($productId: Long!){
                getTopicMaxOrderByProduct(productId: $productId)${fields.TopicMaxOrderOutput}
            }`
            , {
                productId
            }
        );
    };
    // MUTATIONS -----------------------------------------------------------------------------------------------

    /**
     * Create Topic
     * @param data data of Topic to be created
     */
    public createTopic(data: any): Observable<any> {
        return this.request(
            this.clientName,
            `mutation createTopic($input: TopicInput!) {
                createTopic(input: $input) ${fields.topic}
            }`, {
                input: data
            }
        );
    };
    /**
     * Update Topic
     * @param id the id of topic to be updated
     * @param data data to be updated
     */
    public updateTopic(id: number, data: any): Observable<any> {
        return this.request(
            this.clientName,
            `mutation updateTopic($id: Long!, $input: TopicInput!) {
                updateTopic(id: $id, input: $input) ${fields.topic}
            }`, {
                id,
                input: data
            }
        );
    };

}
