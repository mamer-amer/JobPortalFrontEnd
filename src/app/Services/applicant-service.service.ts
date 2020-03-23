import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { id_ID } from 'ng-zorro-antd';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ApplicantServiceService {

  
  constructor(private http: HttpClient, private _location: Location,private router:Router) { }
   url:any = environment.baseUrl;

   logout(){
    sessionStorage.clear();
     this.router.navigate(['']);
  }

  saveUserForm(adduserObj:any):Observable<any>{
  return this.http.post(this.url+"token/user",adduserObj)
  }

 

  

  getUserByEmail(email):Observable<any>{
    let userId=sessionStorage.getItem("userId");
    return this.http.get(this.url+"token/user/"+userId);
  }
  getUserById(id:any):Observable<any>{
    return this.http.get(this.url+"token/user/"+id);
  }



  postCandidateProfile(id,obj:any):Observable<any>{
    return this.http.post(this.url+"api/cp/"+id,obj);
  }

  registerUser(registerObj: any): Observable<any> {
    return this.http.post(this.url + "token/user", registerObj);
  }



  getCurrentProfileUserStauts(userId:any):Observable<any>{
    return this.http.get(this.url +"token/user/"+userId);
   
  }
  getAllJobs():Observable<any>{
    return this.http.get(this.url + "api/job/all");
   
  }

  getPaginatedJobs(page):Observable<any>{
    return this.http.get(this.url+"api/job/paginatedjobs?page="+page);
  }

  getPaginatedJobsByCategory(category,page):Observable<any>{
    return this.http.get(this.url+"api/job/jobsbycategory?category="+category+"&page="+page);
  }

  postAJob(jobObj: any): Observable<any> {
    return this.http.post(this.url + "api/job/", jobObj);
  }


  searchJobWithRespectToField(field:any):Observable<any>{
    return this.http.get(this.url + "api/job/"+ field);
  }



  postCompanyProfile(userId:any,companyProfile:any):Observable<any>{
    return this.http.post(this.url +"api/companyprofile/"+userId,companyProfile)
  }

  getJobsByEmployeeId(id:any):Observable<any>{
    return this.http.get(this.url + "api/job/myJobs/"+id);

  }

  goBack() {
    this._location.back();

  }

}
