import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Responsible } from '../models/Responsible';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ResponsibleServices {
  public constructor(private http: HttpClient) { }
  getAllResponsibleByProductName(productId: string): Observable<Responsible[]> {
    return this.http.get<Responsible[]>(
      environment.coreUrl +
      '/services/request/getJsonData/1000372?param1=' +
      productId
    );
  }

  getAllResponsibleByUS(US): Observable<Responsible[]> {
    return this.http.get<Responsible[]>(
      environment.coreUrl +
      '/services/request/getJsonData/1000371?param1=' +
      US
    );
  }
}
