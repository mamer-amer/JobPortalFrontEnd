import { Injectable } from "@angular/core";
import { NgxSpinnerService } from 'ngx-spinner';

import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, throwError, of } from "rxjs";
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
// import { nextContext } from "@angular/core/src/render3";

@Injectable()
export class NoopInterceptor implements HttpInterceptor {

  constructor(private router: Router,
    private spinner: NgxSpinnerService
  ) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if(!req.url.includes("notification"))
    this.spinner.show();

    if (sessionStorage.length > 0) {
      
      const changedReq = req.clone({ headers: req.headers.set('Authorization', sessionStorage.getItem('token')) });
      return next.handle(changedReq).pipe(
        map((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            this.spinner.hide();
          }
          return event;
        }), catchError((error: any) => {
          if (error instanceof HttpErrorResponse) {
            this.spinner.hide();
            if (error.status == 401)
              this.router.navigate(['**']);
          }
          return of(error);
        })


      );
    } else {
     
      const changedReq = req.clone({ headers: req.headers.set('Content-Type', 'application/json') })

      return next.handle(changedReq).pipe(
        map((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            this.spinner.hide();
          }

          this.spinner.hide();
          return event;
        }));
    }


  }
}
