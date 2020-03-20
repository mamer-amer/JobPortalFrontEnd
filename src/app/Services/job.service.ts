import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(private http:HttpClient) {

   }

   public postJob(obj:Object):Observable<any>{
     return this.http.post(environment.baseUrl+"api/job/",obj)
   }
}
