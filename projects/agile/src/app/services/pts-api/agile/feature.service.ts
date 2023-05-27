import { Injectable, Injector } from '@angular/core';

import * as fields from './feature.fields';
import { Observable } from 'rxjs';
import { AgileService } from './agile.service';

@Injectable({
    providedIn: 'root'
})
export class FeatureGrapgQlService extends AgileService {

    constructor(protected injector: Injector) {
        super(injector);
        // Create GraphQL client
        this.createClient();
    }

    // QUERIES ------------------------------------------------------------------------------------------------- 

    /**
     * Get features by product id
     * @param productId the given product to filter Features
     */
    public getFeaturesByProductId(productId: number): Observable<any> {
        return this.request(this.clientName,
            `query getFeaturesByProductId($productId: Long!){
               getFeaturesByProductId(productId: $productId)${fields.features}
            }`
            , {
                productId
            }
        );
    };
    /**
     * get Feature MaxOrder
     * @param productId the given product to filter Features
     */
    public getFeatureMaxOrder(productId: number): Observable<any> {
        return this.request(this.clientName,
            `query getFeatureMaxOrderByProduct($productId: Long!){
                getFeatureMaxOrderByProduct(productId: $productId)${fields.FeatureMaxOrderOutput}
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
    public getById(id: number): Observable<any> {
        return this.request(this.clientName,
            `query getFeature($id: Long!){
                getFeature(id: $id)${fields.feature}
            }`
            , {
                id
            }
        );
    };
    // MUTATIONS -----------------------------------------------------------------------------------------------

    /**
     * Create Feature
     * @param data data of Feature to be created
     */
    public createFeature(data: any): Observable<any> {
        return this.request(
            this.clientName,
            `mutation createFeature($input: FeatureInput!) {
                createFeature(input: $input) ${fields.feature}
            }`, {
            input: data
        }
        );
    };
    /**
     * Update Feature
     * @param id the id of feature to be updated
     * @param data data to be updated
     */
    public updateFeature(id: number, data: any): Observable<any> {
        return this.request(
            this.clientName,
            `mutation updateFeature($id: Long!, $input: FeatureInput!) {
                updateFeature(id: $id, input: $input) ${fields.feature}
            }`, {
            id,
            input: data
        }
        );
    };

}
