import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  public score = 0;
  constructor() { }
  public getScore() {
    return this.score;
  }
  public setScore(score) {
    this.score = score;
  }
}
