import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TenderService {

  constructor(private http:HttpClient) { }
  public postTender(obj: Object): Observable<any> {
    return this.http.post(environment.baseUrl + "api/tender", obj)
  }
  public gettenderbyid(tenderid:any):Observable<any>{
    return this.http.get(environment.baseUrl+"api/tender/"+tenderid);
  }
  public getAlltenderNotifications(recruiterId:any):Observable<any>{
    return this.http.get(environment.baseUrl+"api/tendernotification/recruiter/"+recruiterId);
  }
}
