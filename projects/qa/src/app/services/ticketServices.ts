import { Injectable } from '@angular/core';
import { Ticket } from '../models/Ticket';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TicketServices {

  private baseURL = `${environment.gatewayUrl}/qa-service`;

  public constructor(private http: HttpClient) {
  }

  addTicket(ticket: Ticket): Observable<any> {
    return this.http.post(this.baseURL + '/tickets', ticket, { responseType: 'text' as 'json' });
  }

  getAllTicketByTestId(testId): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.baseURL + '/tickets?testId=' + testId);
  }
}
