import {Injectable, Component} from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {Training} from './Training';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'training-service',
  templateUrl: './services.component.html'
})

@Injectable()
export class TrainingService {
  constructor(private http: HttpClient) {}

  getTraining() {
    return this.http.get('/assets/TrainingObject.json')
      .pipe(map(data => data as Array<Training>));
  }

}
