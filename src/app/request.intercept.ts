import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable,throwError,of  } from "rxjs";
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
// import { nextContext } from "@angular/core/src/render3";

@Injectable()
export class NoopInterceptor implements HttpInterceptor {

  constructor(private router: Router, private spinner: NgxSpinnerService){}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    this.spinner.show();

      if(sessionStorage.length>0){
        const changedReq = req.clone({headers: req.headers.set('Authorization', sessionStorage.getItem('token'))});
        return next.handle(changedReq).pipe(
          map((event: HttpEvent<any>) => {
              if (event instanceof HttpResponse) {
                  // console.log('event--->>>', event);
                  this.spinner.hide();
              }
              return event;
          }),catchError((error: any) => { 
            if(error instanceof HttpErrorResponse) {
                    console.log(error);
              this.spinner.hide();
              this.router.navigate(['**']);
                    if(error.status == 401){
                      this.router.navigate(['']);
                    }
            }
            return of(error);
        })
        
        
        );
      }else{
        // // sessionStorage.clear();
        // this.router.navigate(['']);
        this.spinner.hide();
         const changedReq = req.clone({headers: req.headers.set('Content-Type', 'application/json')});
        // const changedReq = req.clone();
         //return next.handle(changedReq);

         return next.handle(changedReq).pipe(
          map((event: HttpEvent<any>) => {
              if (event instanceof HttpResponse) {
                  console.log('event--->>>', event);
              }
              return event;
          }));
      }


  }
}
