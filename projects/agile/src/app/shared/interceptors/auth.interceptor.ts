import { environment } from '../../../environments/environment';
import {
  HttpEvent, HttpParams
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private userService: UserService
  ) { }
  intercept(
    req: HttpRequest<any>, next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const url = req.url.toLowerCase();
    if (this.isPTSGatewayUrl(url)) {
      return this.performAuthorizedRequest(req, next);
    } else if (this.isPTSCoreUrl(url) && req.method === 'GET') {
      
      const token = localStorage.getItem('PTSSSOID');
      if (token && token !== '') {
        const newReq = req.clone({
          params: (req.params ? req.params : new HttpParams())
            .set('PTSSSOID', token)
        });
        return next.handle(newReq);
      }else{
        return next.handle(req);
      }
    } else {
      return next.handle(req);
    }
  }
  /**
   * Returns true, if the given url should be handled by the interceptor.
   */
  private isPTSGatewayUrl(url: string): boolean {
    return [environment.gatewayUrl].some((u) => url.startsWith(u));
  }

  /**
 * Returns true, if the given url should be handled by the interceptor.
 */
  private isPTSCoreUrl(url: string): boolean {
    return [`${environment.coreUrl}/services`].some((u) => url.startsWith(u));
  }

  /**
   * @param req request
   * @param next next handler
   */
  private performAuthorizedRequest(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<any> {
    return this.refreshUserCode().pipe(
      switchMap((data) => {
        const userInfo = JSON.parse(data);
        req = this.cloneToAuthorizedRequest(req, userInfo.userCode);
        return next.handle(req);
      })
    );
  }

  private cloneToAuthorizedRequest(req: HttpRequest<any>, userCode: string) {
    const headers = req.headers.set('actor', userCode);
    return req.clone({ headers });
  }

  refreshUserCode(): Observable<string> {
    return new Observable((observer) => {
      this.userService.getCurrentUser().subscribe((userData) => {
        const userCode: string = userData[0].user_code;
        const role: string = userData[0].role;
        const userInfo = { userCode: userCode, role: role };
        observer.next(JSON.stringify(userInfo));
        observer.complete();
      });
    });
  }

}

