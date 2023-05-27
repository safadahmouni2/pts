import { environment } from '../../environments/environment';
import {
  HTTP_INTERCEPTORS, HttpEvent, HttpErrorResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpParams
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserService } from '../services/userService';
import { ErrorInterceptor } from '../services/error.interceptor';
import { ToastrService } from 'ngx-toastr';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private toastr: ToastrService,
    private userService: UserService
  ) { }
  intercept(
    req: HttpRequest<any>, next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const url = req.url.toLowerCase();
    if (this.isPTSCoreUrl(url) && req.method === 'GET') {
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
    } if (!this.checkUrl(url) || req.method === 'GET') {
      return next.handle(req);
    } else {
      return this.performAuthorizedRequest(req, next);
    }
  }
  /**
   * Returns true, if the given url should be handled by the interceptor.
   */
  private checkUrl(url: string): boolean {
    return [environment.gatewayUrl+'/qa-service'].some((u) => url.startsWith(u));
  }

   /**
   * Returns true, if the given url should be handled by the interceptor.
   */
   private isPTSCoreUrl(url: string): boolean {
    return [environment.coreUrl].some((u) => url.startsWith(u));
  }
  /**
   * @param req request
   * @param next next handler
   * @param retryWithNewWebsiteToken if true, a failed website-token-request will be retried with a newly retrieved website token
   */
  private performAuthorizedRequest(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<any> {
    return this.refreshUserCode().pipe(
      switchMap((data) => {
        const userInfo = JSON.parse(data);
        if (['TESTER', 'QUALITY MANAGER', 'ADMIN'].includes(userInfo.role)) {
          req = this.cloneToAuthorizedRequest(req, userInfo.userCode);
          return next.handle(req);
        } else {
          const error = new HttpErrorResponse({ status: 422 });
          this.toastr.error('Action Not Allowed');
          return of(error) as any;
        }
      })
    );
  }


  private cloneToAuthorizedRequest(req: HttpRequest<any>, userCode: string) {
    const headers = req.headers.set('actor', userCode);
    return req.clone({ headers });
  }

  refreshUserCode(): Observable<string> {
    return new Observable((observer) => {
      this.userService.getUser().subscribe((userData) => {
        const userCode: string = userData[0].user_code;
        const role: string = userData[0].role;
        const userInfo = { userCode: userCode, role: role };
        observer.next(JSON.stringify(userInfo));
        observer.complete();
      });
    });
  }

}

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
  },
];
