import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { id_ID } from 'ng-zorro-antd';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { browser } from 'protractor';


@Injectable({
  providedIn: 'root'
})
export class ApplicantServiceService {

  private sourceObject = new Subject();
  getObject = this.sourceObject.asObservable();

  constructor(private http: HttpClient, private _location: Location,private router:Router,private toastService:ToastrService) { }
   url:any = environment.baseUrl;


  passObject(obj:any) {
    this.sourceObject.next(obj);
  }

   logout(){
    sessionStorage.clear();
    localStorage.clear();
    
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
    if(sessionStorage.getItem('userType')=="candidate"){
      return this.http.get(this.url + "api/cp/" + userId);
    }
    else if (sessionStorage.getItem('userType') == "employee"){
      return this.http.get(this.url + "api/companyprofile/userId/" + userId);

    }
   
   
  }
  getAllJobs():Observable<any>{
    return this.http.get(this.url + "api/job/all");
   
  }

  getPaginatedJobs(page):Observable<any>{
    return this.http.get(this.url+"api/job/paginatedjobs?page="+page);
  }

  getJobsByCompany(page): Observable<any> {
    return this.http.get(this.url + "api/job/myJobs/?page="+page);
  }

  getPaginatedJobsByCategory(category,page):Observable<any>{
    category = category.replace(/&/g,'_and_');
    return this.http.get(this.url+"api/job/jobsbycategory?category="+category+"&page="+page);
  }

  postAJob(jobObj: any): Observable<any> {
    return this.http.post(this.url + "api/job/", jobObj);
  }

  getJobById(id):Observable<any>{
    return this.http.get(this.url+"api/job/?id="+id);
  }

  getJobCompany(id):Observable<any>{
    return this.http.get(this.url+"api/job/company?id="+id);
  }


  searchJobWithRespectToField(field:any):Observable<any>{
    return this.http.get(this.url + "api/job/"+ field);
  }



  postCompanyProfile(userId:any,companyProfile:any):Observable<any>{
    return this.http.post(this.url +"api/companyprofile/"+userId,companyProfile)
  }

  getCompanyProfile(companyId:any):Observable<any>{
    return this.http.get(this.url+"api/companyprofile/"+companyId);
  }

  getJobsByEmployeeId(id:any):Observable<any>{
    return this.http.get(this.url + "api/job/myJobs/"+id);

  }
  applyJob(obj:any):Observable<any>{
    return this.http.post(this.url + "api/job/applyJob",obj);

  }

  goBack() {

    const token = sessionStorage.getItem('token');
    this._location.back();

  }

  toastSuccess(message, title) {
    this.toastService.success(message, title);
  }
  toastError(message, title) {
    this.toastService.error(message, title);
  }
  toastInfo(message, title) {
    this.toastService.info(message, title);
  }
  toastWarning(message, title) {
    this.toastService.warning(message, title);
  }

  getReviewsById(id):Observable<any>{
    return this.http.get(this.url + "api/review/averageRating?companyId="+id);
  }

  isAlreadyApplied(canId,jobId):Observable<any>{
    return this.http.get(this.url + "api/cp/alreadyappliedjob?candidateId=" + canId +"&jobId="+jobId);
  }

  isAlreadyCommentedOnCompanyProfile(obj:any):Observable<any>{
    return this.http.post(this.url + "api/review/comment",obj);
  }

  getAllJobsByCityName(city,page):Observable<any>{
    return this.http.get(this.url + "api/job/searchbycity?city=" + city + "&page=" + page);

  }

  getCountOfCandidates(jobId:any):Observable<any>{
    return this.http.get(this.url + "api/job/candidatescount/"+jobId);
  }
  getAppliedCandidatesProfile(jobId:any):Observable<any>{
    return this.http.get(this.url + "api/job/candidateprofiles/"+jobId);
  }
}
