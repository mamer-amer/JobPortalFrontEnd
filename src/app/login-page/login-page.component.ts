import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LoginService } from "./login.service";
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: "app-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.css"]
})
export class LoginPageComponent implements OnInit {
  errorVisible = false;
  showLoading = false;
  constructor(private router: Router, private service: LoginService,private message: NzMessageService) {}

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
    this.showLoading = true;
    // var output = this.service.checkUserandPass(uname, p);
    this.service.checkUserandPass(uname, p).subscribe(
      res => {
        
        if (res.status == 200) {
          this.message.success(res.message, {
            nzDuration: 3000
          });
          this.showLoading = false;
          console.log("User logged in", res);

          sessionStorage.setItem("userId",res.result.id);
          sessionStorage.setItem("token", res.result.token);
          sessionStorage.setItem("email", res.result.email);
          sessionStorage.setItem("username", res.result.username);
          sessionStorage.setItem("userType", res.result.userType);
       
         

          if (res.result.userType === "ADMIN") {
            setTimeout(() => {
              this.router.navigate(["/adduser"]);
            }, 1000);
          }
          else if(res.result.userType == "candidate"){
            setTimeout(() => {
              this.router.navigate(["/candidateProfile"]);
            }, 1000);
          }
          else if(res.result.userType == "employee"){
            setTimeout(() => {
              this.router.navigate(["/companyProfile"]);
            }, 1000);
          }
        }
      else{
        console.log("error")
        this.message.error(res.message, {
          nzDuration: 3000
        });
         this.showLoading = false;
      }
       
      }
     
    );
    // this.message.error("Error Occured", {
    //   nzDuration: 3000
    // });
    this.showLoading = false;

    // if(output == true){
  }

  routeToRegister() {
    this.router.navigate(["register"]);
  }
}
