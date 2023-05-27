import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SectionDto } from '../dto/section-dto';


@Injectable({
  providedIn: 'root'
})
export class SectionService {
  BASE_URL = "http://localhost:8085";
  constructor(private http:HttpClient) { }
  postSection(sectionDto:SectionDto):Observable<any>{
    return this.http.post(this.BASE_URL+ '/api/sections',sectionDto);
  }
  getSectionByTicket(id:any):Observable<any>{
    const httpParams= new HttpParams().set('ticketId',id);

    return this.http.get(this.BASE_URL+'/api/sections',{params:httpParams})

  }

  editSection(id:number,sectionDto:SectionDto):Observable<any>{
    return this.http.put(this.BASE_URL+'/api/sections/'+id,sectionDto)

  }
assignMessageToSection(sectionId:number,messageId:any, order:any):Observable<any>{
    const httpParams= new HttpParams()
    .set('messageId',messageId)
    .set('order',order)
    return this.http.post(this.BASE_URL+'/api/sections/'+sectionId +'/assign_message',null,{params:httpParams});

  }
}
