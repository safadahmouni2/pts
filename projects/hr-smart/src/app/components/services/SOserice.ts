import {Injectable, Component} from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {SO} from './SO';import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'so-service',
  templateUrl: './services.component.html'
})

@Injectable()
export class SOservice {
  constructor(private http: HttpClient) {}

  getSmartObj() {
    return this.http.get('/assets/SOobject.json')
      .pipe(map(data => data as Array<SO>));
  }

}
