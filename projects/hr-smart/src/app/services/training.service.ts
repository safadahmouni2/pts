import { Injectable } from '@angular/core';
import { Training } from '../components/services/Training';
import { TRAININGS } from '../components/services/mock-trainings';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map,tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class TrainingService {

  constructor(private http: HttpClient) {

    }

  // getTrainings(): Observable<Training[]> {
  //     //  return this.http.get("http://192.168.0.78:8085/services/request/getJsonData/1000526")
  //     // .pipe(map(data => data.json() as Array<Training>));
  //  return of(TRAININGS);
  // }

  //  setTrainings(tr: Training): Observable<Training> {
  //   let headers = new Headers({ 'Content-Type': 'application/json' });
  //   let options = new RequestOptions({ headers: headers });
  //   let body = JSON.stringify(tr);
  //   return this.http.post('http://192.168.0.78:8085/services/request/getJsonData/1000526/', body, options ).pipe(map((res: Response) => res.json()));
  // }
}
