import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Proposition } from '../components/services/Proposition';
import { PROPOSITIONS } from '../components/services/mock-propositions';
@Injectable({
  providedIn: 'root'
})
export class PropositionService {

  constructor() { }
  getPropositions(): Observable<Proposition[]> {
    return of(PROPOSITIONS);
  }
}
