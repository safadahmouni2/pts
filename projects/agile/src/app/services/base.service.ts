
import { throwError as observableThrowError, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable()
export class BaseService {


    constructor(public http: HttpClient) { }

    protected httpGet(methodName: string, headers?: HttpHeaders): Observable<any> {
        const options = { headers: headers };
        return this.http
            .get(`${environment.coreUrl}/services${methodName}`, options)
            .pipe(catchError(this.handleError));
    }


    protected callServiceMethodPost(methodName: string, body: any, headers?: HttpHeaders): Observable<any> {
        const options = { headers: headers };
        return this.http
            .post(`${environment.coreUrl}/services${methodName}`, body, options)
            .pipe(catchError(this.handleError));
    }



    protected callServiceMethodGet(methodName: string, options?: HttpHeaders): Observable<any> {
        return this.httpGet(methodName, options)
            .pipe(catchError(this.handleError));
    }
    protected callServiceMethodAdd(methodName: string, body: any, headers?: HttpHeaders): Observable<any> {
        const options = { headers: headers };
        return this.http
            .put(`${environment.coreUrl}/services${methodName}`, body, options)
            .pipe(catchError(this.handleError));
    }
    protected callServiceMethodDelete(methodName: string, headers?: HttpHeaders): Observable<any> {
        const options = { headers: headers };
        return this.http
            .delete(`${environment.coreUrl}/services${methodName}`, options)
            .pipe(catchError(this.handleError));
    }



    protected handleError(error: Response | any): Observable<any> {
        let errMsg: string;
        if (error instanceof HttpResponse) {
            const body = error.body() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return observableThrowError(errMsg);
    }


    upload(file: File, userstoryId: any, transferComplete) {
        const formData: FormData = new FormData();
        formData.append('file', file, file.name);
        formData.append('ticketId', userstoryId);


        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener('progress', (ev: ProgressEvent) => {
            // You can handle progress events here if you want to track upload progress
            // (I used an observable<number> to fire back updates to whomever called this upload)
        });


        xhr.open('POST', `${environment.coreUrl}/services/ticketing/docService/addDoc`, true);
        xhr.onload = function () {
            if (xhr.readyState === xhr.DONE) {
                if (xhr.status === 200) {
                    transferComplete();
                }
            }
        };

        xhr.send(formData);
    }
}
