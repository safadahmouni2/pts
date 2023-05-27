import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
@Injectable()
export class TicketService extends BaseService {
  private baseUrl = '/ticketing/ticket';
  updateState(ticketId: number, stateId: number, stateName: string, loggedUserId: number): Observable<any> {
    const obj: any = {};
    obj.state = stateId;
    obj.stateView = stateName;
    obj.ticketId = ticketId;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    obj.loggedUser = loggedUserId;
    return this.callServiceMethodPost(this.baseUrl + '/save?fields=state,stateView,ticketId', obj, headers);
  }



}
