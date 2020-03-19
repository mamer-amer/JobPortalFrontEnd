import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { id_ID } from 'ng-zorro-antd';


@Injectable({
  providedIn: 'root'
})
export class ApplicantServiceService {

  
  constructor(private http: HttpClient) { }
   url:any = environment.baseUrl;

   logout(router){
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('userType');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('organizationName');
    sessionStorage.removeItem('userImage');
     router.navigate(['']);
  }

  saveUserForm(adduserObj:any):Observable<any>{
  return this.http.post(this.url+"token/user",adduserObj)
  }

 

 

  getUserByEmail(email):Observable<any>{
    return this.http.get(this.url+"token/user/"+email);
  }

  postCandidateProfile(id,obj:any):Observable<any>{
    return this.http.post(this.url+"api/cp/"+id,obj);
  }

  registerUser(registerObj: any): Observable<any> {
    return this.http.post(this.url + "token/user", registerObj);
  }



  getCurrentProfileUserStauts(userId:any):Observable<any>{
    return this.http.get(this.url + "token/user/"+userId);
   
  }
  getAllJobs():Observable<any>{
    return this.http.get(this.url + "api/job/all");
   
  }


  postAJob(jobObj: any): Observable<any> {
    return this.http.post(this.url + "api/job/", jobObj);
  }


  searchJobWithRespectToField(field:any):Observable<any>{
    return this.http.get(this.url + "api/job/"+ field);


  }


}
