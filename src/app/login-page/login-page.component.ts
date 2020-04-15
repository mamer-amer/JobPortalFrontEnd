import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { LoginService } from "./login.service";
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ToastrService } from 'ngx-toastr';
import { MDBModalRef, MDBModalService } from 'angular-bootstrap-md';
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
  basicModal:MDBModalRef;
  constructor(private toastService: ToastrService, private router: Router, private service: LoginService,private modalService:NzModalService) {}

  ngOnInit(): void {
    if(sessionStorage.length>0){
     
      // this.showModal();
      this.showDeleteConfirm();
    }
    else{
      localStorage.clear();
    }
    
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
          window.history.go(-1);
      }
    });
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

    this.service.checkUserandPass(uname, p).subscribe(
      res => {

        if (res.status == 200) {

          this.toastService.info('Successfull', 'User authenticated')

          sessionStorage.setItem("userId", res.result.id);
          sessionStorage.setItem("token", res.result.token);
          sessionStorage.setItem("email", res.result.email);
          sessionStorage.setItem("username", res.result.username);
          sessionStorage.setItem("userType", res.result.userType);


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
          else if (res.result.userType == "employee") {
            setTimeout(() => {
              this.router.navigate(["/companyProfile"]);
            }, 1000);
          }
        }
        else {
          this.toastService.error('Unuccessfull', 'Invalid login credentials');
        }
      }, err => this.toastService.error('Unuccessfull', 'Invalid login credentials')
    );

  }

  routeToRegister() {
    this.router.navigate(["register"]);
  }
}
