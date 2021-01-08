import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/login-page/login.service';

@Component({
  selector: 'app-forgotpasswordscreen',
  templateUrl: './forgotpasswordscreen.component.html',
  styleUrls: ['./forgotpasswordscreen.component.css']
})
export class ForgotpasswordscreenComponent implements OnInit {

  status:boolean=false;
  constructor(private router:Router,private loginservice:LoginService,private toastService: ToastrService) { }

  ngOnInit(): void {
  }
  routeToLogin(){
    this.router.navigate([''])

  }
  submit(email:any){
    this.status=true
    this.loginservice.forgotPasswordEmail(email).subscribe(data=>{
      console.log(data);
      if(data.status==200){
        this.status=false;
        this.toastService.info("Success","A Link Has Been Sent To Your Email! kindly Check")
        setTimeout(() => {
      this.router.navigate([""])
        }, 4000);
    
      }else{
        this.status=false;
        this.toastService.error("Failed","User Doesnot Exsist")
      }

    })

  
  }

}
