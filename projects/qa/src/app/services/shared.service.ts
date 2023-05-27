import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private subject = new Subject<void>();
  private attachmentSTatesChange = new Subject<void>();

  sendClickEvent() {
    this.subject.next();
  }

  sendAttachEventState() {
    this.attachmentSTatesChange.next();
  }

  getClickEvent(): Observable<any> {
    return this.subject.asObservable();
  }

  getAttachEventState(): Observable<any> {
    return this.attachmentSTatesChange.asObservable();
  }
}
