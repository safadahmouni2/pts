import { Injectable, Injector } from '@angular/core';
import { BaseGraphQLService } from '../../base-graphql/base-graphql.service';

export class AgileService  extends BaseGraphQLService {

    clientName = 'agile-service';

    createClient(urlInput?: string): void {
        super.createClient(this.clientName, urlInput);
    }
}
