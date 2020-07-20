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

  constructor(private http: HttpClient, private _location: Location, private router: Router, private toastService: ToastrService) { }
  url: any = environment.baseUrl;

  userType = sessionStorage.getItem('userType');


  passObject(obj: any) {
    this.sourceObject.next(obj);
  }

  logout() {
    sessionStorage.clear();
    localStorage.clear();

    this.router.navigate(['']);

  }

  saveUserForm(adduserObj: any): Observable<any> {
    return this.http.post(this.url + "token/user", adduserObj)
  }





  getUserByEmail(email): Observable<any> {
    let userId = sessionStorage.getItem("userId");
    return this.http.get(this.url + "token/user/" + userId);
  }
  getUserById(id: any): Observable<any> {
    return this.http.get(this.url + "token/user/" + id);
  }



  postCandidateProfile(id, obj: any): Observable<any> {
    return this.http.post(this.url + "api/cp/" + id, obj);
  }

  registerUser(registerObj: any): Observable<any> {
    return this.http.post(this.url + "token/user", registerObj);
  }



  getCurrentProfileUserStauts(userId: any): Observable<any> {
    if (sessionStorage.getItem('userType') == "candidate") {
      return this.http.get(this.url + "api/cp/" + userId);
    }
    else if (sessionStorage.getItem('userType') != "candidate") {
      return this.http.get(this.url + "token/" + userId);

    }

  }
  getAllJobs(): Observable<any> {
    return this.http.get(this.url + "api/job/all");

  }

  getCandidateProfileForView(userId: any, candId: any): Observable<any> {
    return this.http.get(this.url + "api/cp/complete?userId=" + userId + "&candidateId=" + candId);
  }

  getPaginatedJobs(page): Observable<any> {
    return this.http.get(this.url + "api/job/paginatedjobs?page=" + page);
  }

  getJobsByCompany(page): Observable<any> {
    return this.http.get(this.url + "api/job/myJobs/?page=" + page);
  }
  getJobsByCompanyPrivate(page, id: any): Observable<any> {
    return this.http.get(this.url + "api/recruiter/get/job/" + id + "?page=" + page);
  }

  getPaginatedJobsByCategory(category, page): Observable<any> {
    category = category.replace(/&/g, '_and_');
    return this.http.get(this.url + "api/job/jobsbycategory?category=" + category + "&page=" + page);
  }
  getPaginatedJobsByCategoryPrivate(category, page): Observable<any> {
    category = category.replace(/&/g, '_and_');
    return this.http.get(this.url + "api/recruiter/jobsbycategory?category=" + category + "&page=" + page);
  }

  postAJob(jobObj: any): Observable<any> {
    return this.http.post(this.url + "api/job/", jobObj);
  }

  getJobById(id): Observable<any> {

    return this.http.get(this.url + "api/job/?id=" + id);


  }
  getJobByIdInGeneral(id, type: string): Observable<any> {
    if (type == "public") {

      return this.http.get(this.url + "api/job/?id=" + id);
    }
    else {
      return this.http.get(this.url + "api/recruiter/get/" + id)
    }
  }

  getJobCompany(id): Observable<any> {
    return this.http.get(this.url + "api/job/company?id=" + id);
  }


  searchJobWithRespectToField(field: any): Observable<any> {
    return this.http.get(this.url + "api/job/" + field);
  }



  postCompanyProfile(userId: any, companyProfile: any): Observable<any> {
    return this.http.post(this.url + "api/companyprofile/"+userId, companyProfile)
  }

  getCompanyProfile(userId: any): Observable<any> {
    return this.http.get(this.url + "token/" + userId);
    // return this.http.get(this.url + "api/companyprofile/" + companyId);
  }

  getJobsByEmployeeId(id: any): Observable<any> {
    return this.http.get(this.url + "api/job/myJobs/" + id);

  }
  applyJob(obj: any): Observable<any> {
    return this.http.post(this.url + "api/job/applyJob", obj);

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

  getReviewsById(id): Observable<any> {
    return this.http.get(this.url + "api/review/averageRating?companyId=" + id);
  }

  isAlreadyApplied(canId, jobId): Observable<any> {
    return this.http.get(this.url + "api/cp/alreadyappliedjob?candidateId=" + canId + "&jobId=" + jobId);
  }
  getNotRefferdJobs(canId, companyId, pageNo): Observable<any> {
    return this.http.get(this.url + "api/recruiter/notReferedJobs?candId=" + canId + "&companyId=" + companyId + "&page=" + pageNo);
  }

  isAlreadyCommentedOnCompanyProfile(obj: any): Observable<any> {
    return this.http.post(this.url + "api/review/comment", obj);
  }

  getAllJobsByCityName(city, page): Observable<any> {
    return this.http.get(this.url + "api/job/searchbycity?city=" + city + "&page=" + page);

  }

  getCountOfCandidates(jobId: any): Observable<any> {
    return this.http.get(this.url + "api/job/candidatescount/" + jobId);
  }
  getAppliedCandidatesProfile(jobId: any): Observable<any> {
    return this.http.get(this.url + "api/job/candidateprofiles/" + jobId);
  }
  getSearchCandidatesProfile(value: string): Observable<any> {
    return this.http.get(this.url + "api/recruiter/search?search=" + value);
  }


  globalJobSearch(city, type, company, page): Observable<any> {
    return this.http.get(this.url + `api/job/specifications?city=${city}&type=${type}&company=${company}&page=${page}`);
  }


  deleteJob(id: any, page: any, type: any): Observable<any> {

    if (type == false) {
      return this.http.delete(this.url + "api/job/delete/" + id + "/page?page=" + parseInt(page));
    }

    return this.http.delete(this.url + "api/recruiter/delete/" + id + "/page?page=" + parseInt(page));



  }

  postReviewAgainstCandidate(obj: any): Observable<any> {
    return this.http.post(this.url + "api/review/reivewAgainstCandidate", obj)
  }

  updateJob(id: any, jobObj: any): Observable<any> {
    return this.http.put(this.url + "api/job/update/" + id, jobObj);
  }

  //recruiter

  getRecruiterProfile(id): Observable<any> {
    return this.http.get(this.url + "api/recruiter")
  }

  //NOTIFICATION SERVICE CALLS

  getCompanyNotifications(id, pageNo): Observable<any> {
    if (this.userType != "candidate") {
      return this.http.get(this.url + "api/companyprofile/notifications/" + id + "?page=" + pageNo);

    }
    return this.http.get(this.url + "api/cp/notifications/" + id + "?page=" + pageNo);
  }

  getCompanyNotificationsCount(id): Observable<any> {

    if (this.userType != "candidate") {

      return this.http.get(this.url + "api/companyprofile/notification_count/" + id);
    }
    else {
      return this.http.get(this.url + "api/cp/notification_count/" + id);
    }
  }

  markAllNoticationsAsRead(id): Observable<any> {
    if (this.userType != "candidate") {
      return this.http.get(this.url + "api/companyprofile/notifications_read/" + id);
    }
    return this.http.get(this.url + "api/cp/notifications_read/" + id);

  }

  markAnotificationAsRead(id, jobId): Observable<any> {
    if (this.userType != "candidate") {
      return this.http.get(this.url + "api/companyprofile/notification_marked?companyId="
        + id + "&jobId=" + jobId)
    }
    return this.http.get(this.url + "api/cp/notification_marked?candidateId="
      + id + "&jobId=" + jobId)

  }

  //requests

  getFriendshipStatus(userId, friendId, type): Observable<any> {
    let obj = {
      userId,
      friendId,
      type
    }
    return this.http.post(this.url + "api/get-friendship-status", obj);
  }

  sendFriendRequest(userId, friendId, type): Observable<any> {
    let obj = {
      userId,
      friendId,
      type
    }
    return this.http.post(this.url + "api/send-request", obj);
  }

  cancelFriendRequest(userId, friendId, type): Observable<any> {
    let obj = {
      userId,
      friendId,
      type
    }
    return this.http.post(this.url + "api/cancel-request", obj);
  }

  getAllRequests(userId): Observable<any> {


    return this.http.get(this.url + "api/get-all-requests/" + userId);
  }


  acceptRequest(userId, friendId, type): Observable<any> {
    let obj = {
      userId,
      friendId,
      type
    }
    return this.http.post(this.url + "api/accept-request", obj);
  }

  getAllFriends(id): Observable<any> {
    return this.http.get(this.url + "api/get-all-friends/" + id);
  }

  //chat service\


  initiateChat(user1, user2): Observable<any> {
    return this.http.get(this.url + "api/initiate-chat?user1=" + user1 + "&user2=" + user2)
  }

  getAllChatroomChats(chatroomId,userId):Observable<any>{
    return this.http.get(this.url+"api/get-all-chats/"+chatroomId+"/"+userId);
  }

  getAllChatrooms(userId):Observable<any>{
    return this.http.get(this.url+"api/get-all-chatrooms/"+userId);
  }

  getChatCount(userId):Observable<any>{
    return this.http.get(this.url+"api/get-chat-count/"+userId)
  }
}
