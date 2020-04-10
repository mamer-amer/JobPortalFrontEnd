import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LoginService } from "./login.service";
import { NzMessageService } from 'ng-zorro-antd';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment'
@Component({
  selector: "app-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.css"]
})
export class LoginPageComponent implements OnInit {
  errorVisible = false;
  showLoading = false;
  constructor(private toastService: ToastrService, private router: Router, private service: LoginService, private message: NzMessageService) { }

  ngOnInit(): void {
    localStorage.clear();

   
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
