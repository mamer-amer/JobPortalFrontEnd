import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { NavbarService } from '../navbar.service';
import { ToastrService } from 'ngx-toastr';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BehaviorSubject, Subject } from 'rxjs';
import { CompanyProfileComponent } from '../company-profile/company-profile.component'
import { CandidateProfileComponent } from '../candidate-profile/candidate-profile.component';
import { LoginService } from '../login-page/login.service';


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
  notificationsCount = 0;
  notificationOpen: any;



  constructor(private candP: CandidateProfileComponent, private companyProf: CompanyProfileComponent, private toastService: ToastrService, public service: ApplicantServiceService, public navbarService: NavbarService, private nzMessageService: NzMessageService, private logingSerivce: LoginService) {
    this.notificationOpen = false;
    this.companyProf.logoChangeObservable.subscribe(() => this.userImage = sessionStorage.getItem('dp'));
    this.candP.logoChangeObservable.subscribe(() => this.userImage = sessionStorage.getItem('dp'))

    this.logingSerivce.loggedInUserId.subscribe(value => {
      this.companyId = value ? value : sessionStorage.getItem('companyId');
      console.log("This is company id", this.companyId)
    })
  }

  ngOnInit(): void {

    this.userName = sessionStorage.getItem('username');
    this.userType = sessionStorage.getItem('userType');

    this.userImage = sessionStorage.getItem('dp');
    if (this.companyId) {
      this.getNotificationsCount(this.companyId);
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

  readAllNotications() {
    if (this.companyId) {
      this.service.markAllNoticationsAsRead(this.companyId).subscribe((res) => {
       
        this.notifications = res
      })
    }
  }

  getNotificationsCount(companyId) {
    this.service.getCompanyNotificationsCount(companyId).subscribe((count) => {
      this.notificationsCount = count;
    })
  }

  notificationOpened(isOpen) {

    this.notificationOpen = !this.notificationOpen;

    if (this.companyId) {
      this.getNotificationsCount(this.companyId);
      if (this.notificationOpen) {
        this.service.getCompanyNotifications(this.companyId).subscribe((res) => {
          this.notifications = res;
          console.log(res)
        })
      }
    }
  }

}
