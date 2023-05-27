
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseService } from './base.service';
import { Comment } from '../models/comment.model';


@Injectable()
export class CommentService extends BaseService {

    constructor(public http: HttpClient) {
        super(http);
    }

    addComment(comment: string, ticketId: number): Observable<any> {
        const parametres: any = {};
        parametres.ticketId = ticketId;
        parametres.comment = comment;
        const fields = 'comment,ticketId';
        if (sessionStorage.currentUser) {
            parametres.loggedUser = +JSON.parse(sessionStorage.currentUser).id;
        }

        return this.callServiceMethodPost('/ticketing/ticket/save?fields=' + fields, parametres);
    }

    getComments(ticketId: number): Observable<any> {
        return this.callServiceMethodGet('/request/getJsonData/1000363?param1=' + ticketId);
    }
}
