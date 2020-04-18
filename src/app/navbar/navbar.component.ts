import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { NavbarService } from '../navbar.service';
import { ToastrService } from 'ngx-toastr';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BehaviorSubject, Subject } from 'rxjs';
import {CompanyProfileComponent} from '../company-profile/company-profile.component'
import { CandidateProfileComponent } from '../candidate-profile/candidate-profile.component';
import { LoginService } from '../login-page/login.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
 
  userType:any;
  userName:any;
  userImage:any;
  userId = sessionStorage.getItem('userId');


  
  
  constructor(private candP:CandidateProfileComponent,private companyProf:CompanyProfileComponent,private toastService: ToastrService, public service: ApplicantServiceService, public navbarService: NavbarService, private nzMessageService: NzMessageService,private logingSerivce:LoginService) { 

   this.companyProf.logoChangeObservable.subscribe(()=> this.userImage = sessionStorage.getItem('dp'));
   this.candP.logoChangeObservable.subscribe(()=>  this.userImage = sessionStorage.getItem('dp'))
  }

  ngOnInit(): void {
    this.logingSerivce.loggedInUserId.subscribe(value=>{
      this.userId = value?value:sessionStorage.getItem('userId');
      console.log("This is user id",this.userId)
    })
    this.userName = sessionStorage.getItem('username');
    this.userType = sessionStorage.getItem('userType');
    
    this.userImage = sessionStorage.getItem('dp');
  }

 
  getImage(){

  }
  cancel(): void {
    this.nzMessageService.info('click cancel');
  }

  confirm(): void {
    this.nzMessageService.info('click confirm');
  }


  goBack(){
    
    window.history.go(-1);
  }

}
