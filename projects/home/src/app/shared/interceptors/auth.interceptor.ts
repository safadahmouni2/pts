import { environment } from '../../../environments/environment';
import {
  HttpEvent, HttpParams
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
  ) { }
  intercept(
    req: HttpRequest<any>, next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const url = req.url.toLowerCase();
    if (this.isCoreUrl(url) && req.method === 'GET') {
      const token = localStorage.getItem('PTSSSOID');
      if (token && token !== '') {
        const newReq = req.clone({
          params: (req.params ? req.params : new HttpParams())
            .set('PTSSSOID', token)
        });
        return next.handle(newReq);
      } else {
        return next.handle(req);
      }
    } else {
      return next.handle(req);
    }
  }


  /**
 * Returns true, if the given url should be handled by the interceptor.
 */
  private isCoreUrl(url: string): boolean {
    return [environment.coreUrl].some((u) => url.startsWith(u));
  }

}

