import { Injectable } from '@angular/core';
import { SO } from '../components/services/SO';
import { SmartObjects } from '../components/services/mock-so';
import { Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SmartObjService {

  constructor() { }
  getSmartObjects(): Observable<SO[]> {
    return of(SmartObjects);
  }
}
