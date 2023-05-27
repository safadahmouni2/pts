import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  BASE_URL = "http://localhost:8085";
  constructor(private http:HttpClient) { }
  getTicket(ticketId:number):Observable<any>{
    return this.http.get(this.BASE_URL+'/api/ticket/'+ticketId)
  }
}
