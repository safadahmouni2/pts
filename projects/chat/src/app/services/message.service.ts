import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  BASE_URL = "http://localhost:8085";
  constructor(private http:HttpClient) { }
  getMessageByTicket(id:any):Observable<any>{
    const httpParams= new HttpParams().set('ticketId',id);

    return this.http.get(this.BASE_URL+'/api/messages',{params:httpParams})
}
}
