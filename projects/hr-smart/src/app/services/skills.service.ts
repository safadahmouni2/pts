import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Skills } from '../components/services/skills';
import { SKILLS } from '../components/services/mock-skills';
@Injectable({
  providedIn: 'root'
})
export class SkillsService {

  constructor() { }
  getSkills(): Observable<Skills[]> {
    return of(SKILLS);
  }
}
