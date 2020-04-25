import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { LoginService } from "./login.service";
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ToastrService } from 'ngx-toastr';
import { MDBModalRef, MDBModalService } from 'angular-bootstrap-md';
import { Subject } from 'rxjs';
import { IImage } from 'ng-simple-slideshow';
import { NavbarService } from '../navbar.service';
import { Register } from '../register/Register';

import { ApplicantServiceService } from '../Services/applicant-service.service';
import { NgForm } from '@angular/forms';


export interface information {
  numberOfRegisteredCandidates?: any;
  numberOfCompaniesRegistered?: any;
  numberOfJobsAvailable?: any;
  numOfRegisteredUser?: any;
}


@Component({
  selector: "app-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.css"]
})





export class LoginPageComponent implements OnInit {



  @ViewChild('closebutton') closebutton;
  @ViewChild('myForm') myForm:NgForm;
  siteInfo:information;
  isVisible = false;
  isOkLoading = false;
  errorVisible = false;
  showLoading = false;
  status = false;
  repeatPassword: any;

  loginEmail:any;
  loginPassword:any;

  registerObj: Register = new Register();
  basicModal:MDBModalRef;
  userType;
  userTypes: Array<any>;
  selectedValue: any;
  imageSources: (string | IImage)[] = [
    { url: 'https://cdn.vox-cdn.com/uploads/chorus_image/image/56748793/dbohn_170625_1801_0018.0.0.jpg'},
    { url: 'https://cdn.vox-cdn.com/uploads/chorus_asset/file/9278671/jbareham_170917_2000_0124.jpg' },
    { url: 'https://cdn.vox-cdn.com/uploads/chorus_image/image/56789263/akrales_170919_1976_0104.0.jpg' },
    { url: '../assets/images/slide1.jpg' },
    { url: '../assets/images/slide2.jpg' },
    { url: '../assets/images/slide3.jpg' },
    { url: '../assets/images/slide4.jpg'}
  ];
  height: string = '600px';
  minHeight: string;
  arrowSize: string = '30px';
  showArrows: boolean = true;
  disableSwiping: boolean = false;
  autoPlay: boolean = true;
  autoPlayInterval: number = 3333;
  stopAutoPlayOnSlide: boolean = true;
  debug: boolean = false;
  backgroundSize: string = 'cover';
  backgroundPosition: string = 'center center';
  backgroundRepeat: string = 'no-repeat';
  showDots: boolean = true;
  dotColor: string = '#FFF';
  showCaptions: boolean = true;
  captionColor: string = '#FFF';
  captionBackground: string = 'rgba(0, 0, 0, .35)';
  lazyLoad: boolean = false;
  hideOnNoSlides: boolean = false;
  width: string = '100%';
  fullscreen: boolean = false;
  enableZoom: boolean = false;
  enablePan: boolean = false;
  noLoop: boolean = false;

  

  constructor(private toastService: ToastrService, private router: Router, private service: LoginService, private modalService: NzModalService, private navbar: NavbarService, private registerService: ApplicantServiceService) {
    
  }

  ngOnInit(): void {
    this.getLoginInformation();
    this.navbar.showNav();
    this.userTypes = [
      { value: 'employer', viewValue: 'Employer' },
      { value: 'candidate', viewValue: 'Candidate' },
      { value: 'recruiter', viewValue: 'Recruiter' },
    ];
    this.userType = sessionStorage.getItem('userType');
    if(sessionStorage.length>0){
     
      this.router.navigate(['/allJobs'])
     
    }
    else{
      sessionStorage.clear();
      localStorage.clear();
    }

    
    
  }

  getLoginInformation(){
    this.service.getInformation().subscribe(res=>{
      if(res){

        this.siteInfo = res;
        // this.siteInfo.numOfRegisteredUser = res.numOfRegisteredUser;
        // this.siteInfo.numberOfCompaniesRegistered = res.numberOfCompaniesRegistered;
        // this.siteInfo.numberOfJobsAvailable = res.numberOfJobsAvailable;
        // this.siteInfo.numberOfRegisteredCandidates = res.numberOfRegisteredCandidates;
      }
      
    })
  }
  

  showDeleteConfirm(): void {
    this.modalService.confirm({
      nzTitle: 'Are you sure you want to logout?',
      nzContent: '<b style="color: red;">Press Ok to logout and cancel to go back</b>',
      nzOkText: 'Yes',
      nzOkType: 'danger',
      nzOnOk: () =>{
          sessionStorage.clear();
      },
      nzCancelText: 'No',
      nzOnCancel: () => {
         
      }
    });
  }
  

  




  
  
  check(uname: string, p: string) {
    this.status = true;
    this.service.checkUserandPass(uname, p).subscribe(
      res => {
        
        if (res.status == 200) {
          this.status = false;
          this.myForm.resetForm();
          this.closebutton.nativeElement.click();
          this.toastService.info('Successfull', 'User authenticated')
          sessionStorage.setItem("userId", res.result.id);
          sessionStorage.setItem("token", res.result.token);
          sessionStorage.setItem("email", res.result.email);
          sessionStorage.setItem("username", res.result.username);
          sessionStorage.setItem("userType", res.result.userType);
          this.service.sendId.next(res.result.id);
          
          

          if (res.result.userType === "ADMIN") {
            setTimeout(() => {
              this.router.navigate(["/adduser"]);
            }, 1000);
          }
          else if (res.result.userType == "candidate") {
            setTimeout(() => {
              this.router.navigate(["/candidateProfile"]);
            }, 1000);
          }
          else if (res.result.userType == "employer" || res.result.userType =="recruiter") {
            setTimeout(() => {
              this.router.navigate(["/companyProfile"]);
            }, 1000);
          }
        }
        else {
          this.toastService.error('Unuccessfull', 'Invalid login credentials');
          this.status = false;
        }
      }, err => {
        this.toastService.error('Unuccessfull', 'Invalid login credentials')
        this.status = false
      }
    );

  }

  routeToRegister() {
    this.router.navigate(["register"]);
  }




   registerUser(){
    sessionStorage.clear()
    this.registerObj.active = true;
    this.status = true;

    console.log(this.myForm.value)
    
    
     this.registerService.registerUser(this.registerObj).subscribe(d=>{
     
      if(d.status == 200){
        this.toastService.info('Successfull','User successfully registered')
        this.status = false;
        this.myForm.resetForm();
        this.closebutton.nativeElement.click();
      
        console.log(this.myForm.status);
        
      
      
       
        this.getLoginInformation();
        
      }
      else{
        this.status = false;
        this.toastService.error('Unsuccessful','Something went wrong!')
      }
     
    },err=> {
        this.toastService.error('Unsuccessful', 'Something went wrong!');
        this.status = false;
    }
    
    )

  }

  
  routeToLogin() {
    this.router.navigate([""])
  }
}




