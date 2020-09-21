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
import { TenderService } from '../Services/tender.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  
  userType: any;
  userName: any;
  invitationCount:any=0;
  userImage: any;
  userId = sessionStorage.getItem('userId');
  notifications: Array<any> = [];
  companyId: any = sessionStorage.getItem('companyId');
  candidateId: any = sessionStorage.getItem('candidateId');
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
    this.companyProf.logoChangeObservable.subscribe(() =>
    {
      this.userImage = sessionStorage.getItem('dp') ? sessionStorage.getItem('dp') : null;
      console.log(this.userImage)
    });


    this.candP.logoChangeObservable.subscribe(() => this.userImage = sessionStorage.getItem('dp'))


    this.logingSerivce.loggedInUserId.subscribe(value => {
      this.companyId = value ? value : sessionStorage.getItem('companyId');
      this.getNotificationsCount(this.companyId);
    });

    this.candP.getCandidateId.subscribe(value => {
      this.candidateId = value ? value : sessionStorage.getItem('candidateId');
      this.getNotificationsCount(this.candidateId);
    });



    this.legalCompanyName = sessionStorage.getItem('companyName');
    this.companyProf.legalCompanyNameObserable.subscribe(() => {

      this.legalCompanyName = sessionStorage.getItem('companyName');
    })
  }


  // this.companyProf

  ngOnInit(): void {

    this.userName = sessionStorage.getItem('username');
    this.userType = sessionStorage.getItem('userType');
    console.log("========",this.userType);
    this.companyId = sessionStorage.getItem('companyId');
    this.candidateId = sessionStorage.getItem('candidateId');
   
    this.getRequests(this.userId);
    this.userImage = sessionStorage.getItem('dp')?sessionStorage.getItem("dp"):null;
    // console.log(this.userImage, "========")
    this.getInvitationCount()
    if (this.companyId && this.userType != "candidate") {
      this.getNotificationsCount(this.companyId);
      

    }
    else if (this.candidateId && this.userType == "candidate") {
      this.getNotificationsCount(this.candidateId);
    }
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


    if (jobId && this.companyId && this.userType != "candidate")
      this.service.markAnotificationAsRead(this.companyId, jobId).subscribe(() => {
        this.router.navigate(['appliedcandidates/' + jobId])
      })
    else {
      this.service.markAnotificationAsRead(this.candidateId, jobId).subscribe(() => {
        this.router.navigate(['privatejob/' + jobId])
      })
    }
  }
  readAllNotications() {
    if (this.companyId && this.userType != "candidate") {

      this.service.markAllNoticationsAsRead(this.companyId).subscribe((res) => {

        if (res?.result) {
          this.pageNo = 0;
          this.notifications = res.result.content
          this.getNotificationsCount(this.companyId);
        }
      })
    }

    else {
      this.service.markAllNoticationsAsRead(this.candidateId).subscribe((res) => {

        if (res?.result) {
          this.pageNo = 0;
          this.notifications = res.result.content
          this.getNotificationsCount(this.candidateId);
        }
      })
    }
  }
  onScroll() {

    console.log("total elements", this.totalElements)
    if (this.totalElements > this.notifications.length) {
      this.isLoader = true;
      this.spinner.show("navSpinner");
      this.getNotifications(this.companyId, ++this.pageNo);
    }
  }
  getNotificationsCount(id) {
    this.service.getCompanyNotificationsCount(id).subscribe((count) => {
      this.notificationsCount = count;
    })
  }

  getNotifications(id, page) {

    this.service.getCompanyNotifications(id, page).subscribe((res) => {
      this.isLoader = false;
      this.spinner.hide("navSpinner")
      this.notifications = this.notifications.concat(res.content)
      this.totalElements = res.totalElements;
      console.log(res)
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
    if (this.companyId && this.userType != "candidate") {
      this.getNotificationsCount(this.companyId);
      if (this.notificationOpen) {
        this.getNotifications(this.companyId, this.pageNo)
      }
    }
    else {
      this.getNotificationsCount(this.candidateId);
      if (this.notificationOpen) {
        this.getNotifications(this.candidateId, this.pageNo)
      }
    }
  }


  getRequests(userId) {
    // this.spinner.show("navSpinner");
    // this.isLoader = true;
    this.service.getAllRequests(userId)
      .subscribe((res) => {

        this.requests = res;
        console.log(res)
        this.spinner.hide("navSpinner");
        this.isLoader=false;
        
      }, () => {
        this.spinner.hide("navSpinner");
        this.isLoader = false;
      })

  }

  acceptRequest(id) {
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
        console.log(res)
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

  getInvitationCount(){
    this.service.getInvitationCount(this.userId)
    .subscribe((res)=>{
      console.log(res,"=======count")
      this.invitationCount=res;
    })
  }
  getAllTenderNotification(){
    this.tenderservice.getAlltenderNotifications(this.userId).subscribe(res=>{
      this.tendernotifications=res;
      console.log(this.tendernotifications);
    })
    
  }
  readTenderNotifications(tenderid:any){
    this.router.navigate(['tender-details/'+tenderid]);

  }

}
