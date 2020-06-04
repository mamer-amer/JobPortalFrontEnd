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

  userType: any;
  userName: any;
  userImage: any;
  userId = sessionStorage.getItem('userId');
  notifications: Array<any> = [];
  companyId: any = sessionStorage.getItem('companyId');
  candidateId: any = sessionStorage.getItem('candidateId');
  notificationsCount = 0;
  notificationOpen: any;
  pageNo = 0;
  isLoader = false;
  totalElements = 1;
  legalCompanyName:any = "";



  constructor(private spinner: NgxSpinnerService, private router: Router, private candP: CandidateProfileComponent, private companyProf: CompanyProfileComponent, private toastService: ToastrService, public service: ApplicantServiceService, public navbarService: NavbarService, private nzMessageService: NzMessageService, private logingSerivce: LoginService) {
    this.notificationOpen = false;
    this.companyProf.logoChangeObservable.subscribe(() => this.userImage = sessionStorage.getItem('dp'));
    this.candP.logoChangeObservable.subscribe(() => this.userImage = sessionStorage.getItem('dp'))

    this.logingSerivce.loggedInUserId.subscribe(value => {
      this.companyId = value ? value : sessionStorage.getItem('companyId');
      console.log("This is company id", this.companyId)
    });

    this.legalCompanyName = sessionStorage.getItem('companyName');
    this.companyProf.legalCompanyNameObserable.subscribe(()=>{

      this.legalCompanyName = sessionStorage.getItem('companyName');
    })
  }


  ngOnInit(): void {

    this.userName = sessionStorage.getItem('username');
    this.userType = sessionStorage.getItem('userType');
    this.companyId = sessionStorage.getItem('companyId');
    this.candidateId = sessionStorage.getItem('candidateId');

    this.userImage = sessionStorage.getItem('dp');
    if (this.companyId && this.userType!="candidate") {
      this.getNotificationsCount(this.companyId);
    }
    else if(this.candidateId && this.userType=="candidate"){
      this.getNotificationsCount(this.candidateId);
    }
  }


  getImage() {

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


    if (jobId && this.companyId && this.userType!="candidate")
      this.service.markAnotificationAsRead(this.companyId, jobId).subscribe(() => {
        this.router.navigate(['appliedcandidates/' + jobId])
      })
      else{
      this.service.markAnotificationAsRead(this.candidateId, jobId).subscribe(() => {
        this.router.navigate(['privatejob/' + jobId])
      })
      }
  }
  readAllNotications() {
    if (this.companyId && this.userType!="candidate") {
   
      this.service.markAllNoticationsAsRead(this.companyId).subscribe((res) => {

        if (res?.result) {
          this.pageNo=0;
          this.notifications = res.result.content
          this.getNotificationsCount(this.companyId);
        }
      })
    }

    else{
      this.service.markAllNoticationsAsRead(this.candidateId).subscribe((res) => {

        if (res ?.result) {
          this.pageNo = 0;
          this.notifications = res.result.content
          this.getNotificationsCount(this.candidateId);
        }
      })
    }
  }
  onScroll() {

    console.log("total elements",this.totalElements)
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
    if (this.companyId && this.userType!="candidate") {
      this.getNotificationsCount(this.companyId);
      if (this.notificationOpen) {
        this.getNotifications(this.companyId, this.pageNo)
      }
    }
    else{
      this.getNotificationsCount(this.candidateId);
      if (this.notificationOpen) {
        this.getNotifications(this.candidateId, this.pageNo)
      }
    }
  }

  logout(){
    this.service.logout();
    
  }

}
