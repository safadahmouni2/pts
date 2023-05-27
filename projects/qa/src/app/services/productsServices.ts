import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../models/Product';
import { HttpClient } from '@angular/common/http';
import { Project } from '../models/Project';

@Injectable({
  providedIn: 'root'
})
export class ProductsServices {

  public constructor(private http: HttpClient) {

  }
  getAllProductsByUser(): Observable<Product[]> {
    return this.http.get<Product[]>(environment.coreUrl + '/services/request/getJsonData/1000348');
  }


  getAllProjectsByProductId(productId: number): Observable<any> {
    return this.http.get<Project[]>(
      environment.coreUrl + '/services/request/getJsonData/1000367?param1=' + productId);
  }

  private getAllProjectsByProduct(productName: string): Observable<any> {
    return this.http.get<Project[]>(
      environment.coreUrl + '/services/request/getJson/144?sidx=&page=1&sord=&rows=10&searchTerm=&param1=' + productName);
  }

}
