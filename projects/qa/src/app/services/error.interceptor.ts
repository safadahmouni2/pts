import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router, private toastr: ToastrService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError((error, caught) => {
      this.handleAuthError(request, error);
      return of(error);
    }) as any);
  }


  private handleAuthError(request: HttpRequest<any>, error: HttpErrorResponse): Observable<any> {
    const toastOptions = {
      enableHtml: true,
      closeButton: true,
      progressBar: false,
      tapToDismiss: false,
      disableTimeOut: true,
      enableBootstrap: true,
      positionClass: 'toast-top-full-width'
    };

    if (error.headers && error.headers.get('x-reason')) {
      if (!(error.headers.has('x-handle') && error.headers.get('x-handle') === 'custom')) {
        this.toastr.warning(error.headers.get('x-reason'), '', toastOptions);
      }
    } else {
      if (error.status === 401) {
        this.toastr.info('Invalid username or password, check them and try again');
        return of(error.message);
      } else if (error.status === 403) {
        this.toastr.warning(JSON.parse(error.error).message, '', toastOptions);
        return of(error.message);
      } else if (error.status === 404 || error.status === 503) {
        this.toastr.warning('Backend Server not available', '', toastOptions);

      } else if (error.status === -1) {
        this.toastr.warning('Request not sent. Check your connection and try again.', '', toastOptions);

      } else if (error.status === 500 || error.status === 400) {
        this.toastr.warning('Internal Server Error!', '', toastOptions);
      } else {
        this.toastr.error(error.message, 'Unknown Error!', toastOptions);
        // window.location.reload(true);
      }
    }


    throw error;
  }
}
