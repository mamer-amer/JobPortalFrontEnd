import { TenderService } from './../Services/tender.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { NavbarService } from '../navbar.service';
import { ToastrService } from 'ngx-toastr';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BehaviorSubject, Subject } from 'rxjs';
import { CompanyProfileComponent } from '../company-profile/company-profile.component'
import { CandidateProfileComponent } from '../candidate-profile/candidate-profile.component';
import { LoginService } from '../login-page/login.service';
import { Router } from '@angular/router'
import { NgxSpinnerService } from "ngx-spinner";
import * as moment from 'moment';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  acceptstatus:any='has applied/accepted your offer';
  declinestatus:any='has rejected your offer';
  userType: any;
  userName: any;
  invitationCount:any=0;
  userImage: any;
  userId = sessionStorage.getItem('userId');
  notifications: Array<any> = [];
  notificationsCount = 0;
  messagesCount = 0;
  notificationOpen: any;  
  requestOpen = false;
  pageNo = 0;
  isLoader = false;
  totalElements = 1;
  legalCompanyName: any = "";
  requests = [];
  tendernotifications:any[]=[];
 



  constructor(private spinner: NgxSpinnerService, private router: Router, private candP: CandidateProfileComponent, private companyProf: CompanyProfileComponent, private toastService: ToastrService, public service: ApplicantServiceService, public navbarService: NavbarService, private nzMessageService: NzMessageService, private logingSerivce: LoginService,private tenderservice:TenderService) {


    this.notificationOpen = false;
    this.userImage = sessionStorage.getItem('dp') !='null' && sessionStorage.getItem('dp')?sessionStorage.getItem('dp') : null
    
    this.companyProf.logoChangeObservable.subscribe(() =>
    {
      this.userImage = sessionStorage.getItem('dp') !='null' && sessionStorage.getItem('dp') ? sessionStorage.getItem('dp') : null;
      console.log(this.userImage)
    });


    this.candP.logoChangeObservable.subscribe(() => this.userImage = sessionStorage.getItem('dp'))


    



    this.legalCompanyName = sessionStorage.getItem('companyName');
    this.companyProf.legalCompanyNameObserable.subscribe(() => {

      this.legalCompanyName = sessionStorage.getItem('companyName');
    })
  }


  // this.companyProf

  ngOnInit(): void {

    this.userName = sessionStorage.getItem('username');
    this.userType = sessionStorage.getItem('userType');
    this.getRequests(this.userId);
    if(this.userType=="recruiter"){
      this.userImage = sessionStorage.getItem('dp') !='undefined' ?sessionStorage.getItem('dp') : null;
    }else{
   
    this.userImage = sessionStorage.getItem('dp') !='null' && sessionStorage.getItem('dp')?sessionStorage.getItem('dp') : null;
    }
    this.getNotificationsCount(this.userId);
    this.getInvitationCount()
    this.getAllMessagesCount();

  }


  cancel(): void {
    this.nzMessageService.info('click cancel');
  }

  confirm(): void {
    this.nzMessageService.info('click confirm');
  }


  goBack() {

    window.history.go(-1);
  }

  readNotification(jobId) {


    if (jobId && this.userId && this.userType != "candidate")
      this.service.markAnotificationAsRead(this.userId, jobId,this.pageNo).subscribe(() => {
        this.router.navigate(['appliedcandidates/' + jobId])
      })
    else {
      this.service.markAnotificationAsRead(this.userId, jobId,this.pageNo).subscribe(() => {
        this.router.navigate(['privatejob/' + jobId])
      })
    }
  }
  readAllNotications() {
    if (this.userId && this.userType != "candidate") {

      this.service.markAllNoticationsAsRead(this.userId).subscribe((res) => {

        if (res?.result) {
          this.pageNo = 0;
          this.notifications = res.result.content
          this.getNotificationsCount(this.userId);
        }
      })
    }

    else {
      this.service.markAllNoticationsAsRead(this.userId).subscribe((res) => {

        if (res?.result) {
          this.pageNo = 0;
          this.notifications = res.result.content
          this.getNotificationsCount(this.userId);
        }
      })
    }
  }
  onScroll() {

    console.log("total elements", this.totalElements)
    if (this.totalElements > this.notifications.length) {
      this.isLoader = true;
      this.spinner.show("navSpinner");
      this.getNotifications(this.userId, ++this.pageNo);
    }
  }
  getNotificationsCount(id) {
    this.service.numberOfNotifications(id).subscribe((count) => {
      this.notificationsCount = count;
    })
  } 

  getNotifications(id, page) {

    this.service.getNotifications(id, page).subscribe((res) => {
      this.isLoader = false;
      this.spinner.hide("navSpinner")
      console.log(res);
      this.notifications = this.notifications.concat(res.result.content)
      this.totalElements = res.result.totalElements;
    }, err => {
      this.spinner.hide("navSpinner")
      this.isLoader = false;
    })
  }



  notificationOpened(isOpen) {
    this.isLoader = true;
    this.spinner.show("navSpinner");
    this.pageNo = 0;
    this.notificationOpen = !this.notificationOpen;
    this.notifications = [];
      this.getNotificationsCount(this.userId);
      if (this.notificationOpen) {
        this.getNotifications(this.userId, this.pageNo)
      }
    
   
  }


  getRequests(userId) {
    // this.spinner.show("navSpinner");
    // this.isLoader = true;
    this.service.getAllRequests(userId)
      .subscribe((res) => {

        this.requests = res;
        this.spinner.hide("navSpinner");
        this.isLoader=false;
        
      }, () => {
        this.spinner.hide("navSpinner");
        this.isLoader = false;
      })

  }

  acceptRequest(id) {
    console.log(id);
    this.service.acceptRequest(this.userId, id, "user")
      .subscribe((res) => {

        this.spinner.hide("navSpinner")
        this.isLoader = false;
        this.getRequests(this.userId);
      }, err => this.spinner.hide("navSpinner"))
  }
  deleteRequest(id) {
    this.service.cancelFriendRequest(this.userId, id, "user")
      .subscribe((res) => {
        this.getRequests(this.userId);
      })
  }
  requestOpened(isOpen) {
    this.isLoader = true;
    this.spinner.show("navSpinner");
    this.requestOpen = !this.requestOpen;
    this.requests = [];
    this.getRequests(this.userId);

    console.log(this.userId)
    // this.getRequests(this.userId);
  }
  logout() {
    this.service.logout();

  }

  getAllMessagesCount() {
    this.service.getChatCount(this.userId)
      .subscribe((res) => {
        console.log(res)
        this.messagesCount=res;
      })
  }


  routeToMyCandidateProfile(){
    if(this.userId)
    this.router.navigate([`viewprofile/${this.userId}`])
  }
  routeToMyCompanyProfile(){
    this.router.navigate(['companyProfileDetails/',this.userId])
  }
  getInvitationCount(){
    this.service.getInvitationCount(this.userId)
    .subscribe((res)=>{
      console.log(res,"=======count")
      this.invitationCount=res;
    })
  }
  getAllTenderNotification(){
    if(this.userType=="recruiter"){
      this.isLoader = true;
      this.spinner.show("navSpinner");
      this.tenderservice.getAlltenderNotifications(this.userId).subscribe(res=>{
        this.tendernotifications=res;
        this.isLoader=false;
        this.spinner.hide("navSpinner");
        // if(res?.tender?.tenderType=='public'){
        //     this.acceptstatus = 'has applied to your tender';
        // }
        // else{
        //   this.acceptstatus = 'has accepted your offer';
        // }
        console.log(this.tendernotifications);
      })
    }
    else{
      this.isLoader = true;
      this.spinner.show("navSpinner");
      this.tenderservice.getAlltenderNotificationsForEmployer(this.userId).subscribe(res=>{
      //   if(res?.tender?.tenderType=='public'){
      //     this.acceptstatus = 'has applied to your tender';
      // }
      // else{
      //   this.acceptstatus = 'has accepted/a your offer';
      // }
        this.tendernotifications=res;
        this.isLoader=false;
        this.spinner.hide("navSpinner");
        console.log("=============TENDERnotifications",this.tendernotifications);
      })
    }
   
    
  }
  readTenderNotifications(tenderid:any){
    this.router.navigate(['tender-details/'+tenderid]);

  }

}
