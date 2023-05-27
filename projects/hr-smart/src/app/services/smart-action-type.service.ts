import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SmartActionType } from '../components/services/SmartActionType';
import { SmartTypes } from '../components/services/mock-smart-type';
@Injectable({
  providedIn: 'root'
})
export class SmartActionTypeService {
  so: SmartActionType[] = [];
  constructor() { }
  getSmartTypes(): Observable<SmartActionType[]> {
    return of(SmartTypes);
  }
  getSmartNameById(id) {

    this.getSmartTypes().subscribe(so => this.so = so);
    return this.so.find(so => so.id === id).name;

  }
}
