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

  public postJob(obj: Object): Observable<any> {
    return this.http.post(environment.baseUrl + "api/job/", obj)
  }
  public postRecruiterJob(obj: Object): Observable<any> {
    return this.http.post(environment.baseUrl + "api/recruiter/post/job", obj)
  }
  public referJob(obj: Object): Observable<any> {
    return this.http.post(environment.baseUrl + "api/recruiter/referJobToCandidate", obj)
  }
  public applyOnPrivateJob(obj: Object): Observable<any> {
    return this.http.post(environment.baseUrl + "api/recruiter/apply", obj)
  }

  public getJobDetailsForRecruiter(jobId:any){
    return this.http.get(environment.baseUrl + "api/recruiter/privateJobAllDetails/"+jobId)
  }
  public getJobDetailsForCandidate(jobId:any){
    return this.http.get(environment.baseUrl + "api/recruiter/privateJobDetailForCandidate/"+jobId)
  }
  public undoReferToCandidate(jobId,candId){
    return this.http.delete(environment.baseUrl + "api/recruiter/undoRefer/"+jobId+"/"+candId)
  }


}
