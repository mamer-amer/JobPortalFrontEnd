import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AnyARecord } from 'dns';

@Injectable({
  providedIn: 'root'
})
export class TenderService {

  constructor(private http:HttpClient) { }
  public postTender(obj: any): Observable<any> {
    return this.http.post(environment.baseUrl + "api/tender", obj)
  }
  public gettenderbyid(tenderid:any):Observable<any>{
    return this.http.get(environment.baseUrl+"api/tender/"+tenderid);
  }
  public getAlltenderNotifications(recruiterId:any):Observable<any>{
    return this.http.get(environment.baseUrl+"api/tendernotification/recruiter/"+recruiterId);
  }
  public getAlltenderNotificationsForEmployer(employerUserId:any):Observable<any>{
    return this.http.get(environment.baseUrl+"api/tendernotification/employer/"+employerUserId);
  }

  public acceptOrDeclineTender(object:any,isApplied:boolean):Observable<any>{
    console.log("this is my object",object)
    return this.http.post(environment.baseUrl+"api/tender/accept_decline/"+isApplied,object);
  }

  public getAllPublicTenders():Observable<any>{
    return this.http.get(environment.baseUrl+"api/tender/allByType/public");
  }
  public getAllTendersByUser(id):Observable<any>{
    return this.http.get(environment.baseUrl+"api/tender/allById/"+id);
  }
  public inviteToRecruiterOnPublicTender(obj: any): Observable<any> {
    return this.http.post(environment.baseUrl + "api/publicTenderInvitation", obj)
  }

}