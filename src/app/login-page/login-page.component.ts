import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { LoginService } from "./login.service";
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ToastrService } from 'ngx-toastr';
import { MDBModalRef, MDBModalService } from 'angular-bootstrap-md';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment'
@Component({
  selector: "app-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.css"]
})
export class LoginPageComponent implements OnInit {
  isVisible = false;
  isOkLoading = false;
  errorVisible = false;
  showLoading = false;
  status = false;
  basicModal: MDBModalRef;
  captchaKey: string;
  isCaptcha = false;


  constructor(private toastService: ToastrService, private router: Router, private service: LoginService, private modalService: NzModalService) {
    this.captchaKey = environment.captchaKey;
  }

  ngOnInit(): void {
    if (sessionStorage.length > 0) {
      this.router.navigate(['/allJobs'])
    }
    else {
      sessionStorage.clear();
      localStorage.clear();
    }

  }



  showDeleteConfirm(): void {
    this.modalService.confirm({
      nzTitle: 'Are you sure you want to logout?',
      nzContent: '<b style="color: red;">Press Ok to logout and cancel to go back</b>',
      nzOkText: 'Yes',
      nzOkType: 'danger',
      nzOnOk: () => {
        sessionStorage.clear();
      },
      nzCancelText: 'No',
      nzOnCancel: () => {

      }
    });
  }

  resolved(captchaResponse: string) {
    console.log(`Resolved captcha with response: ${captchaResponse}`);
    if (captchaResponse)
      this.isCaptcha = true;
  }




  login(email, password) {
    this.errorVisible = false;
    if (email == "stepway" && password == "123") {
      localStorage.setItem("user", "admin");
    } else {
      this.errorVisible = true;
    }
  }


  check(uname: string, p: string) {
    this.status = true;
    this.service.checkUserandPass(uname, p).subscribe(
      res => {

        if (res.status == 200) {

          this.toastService.info('Successfull', 'User authenticated')

          console.log(res)
          sessionStorage.setItem("token", res.result.token);
          sessionStorage.setItem("email", res.result.email);
          sessionStorage.setItem("username", res.result.username);
          sessionStorage.setItem("userType", res.result.userType);
          if(res.result.profile){
            sessionStorage.setItem('dp',res.result.profile.dp);
          }
          sessionStorage.setItem("userId", res.result.id);
          this.service.sendId.next(res.result.id);
          this.status = false;

          setTimeout(() => {
            

            if (res.result.userType === "ADMIN") {
              this.router.navigate(["/adduser"]);
            }
            else if (res.result.userType == "candidate") {
              this.router.navigate(["/candidateProfile"]);
            }
            else if (res.result.userType == "employer" || res.result.userType == "recruiter") {

              this.router.navigate(["/companyProfile"]);

            }
            else {
              this.toastService.error('Unuccessfull', 'Invalid login credentials');
              this.status = false;
            }
          }, 1000)



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
  gotoforgotpasswordscreen(){
    this.router.navigate(['forgotpasswordscreen'])
  }
}
