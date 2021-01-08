import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Candidate, ViewCandidateObject } from 'src/app/candidate-profile/candidate';
import { LoginService } from 'src/app/login-page/login.service';

@Component({
  selector: 'app-resetpasswordscreen',
  templateUrl: './resetpasswordscreen.component.html',
  styleUrls: ['./resetpasswordscreen.component.css']
})
export class ResetpasswordscreenComponent implements OnInit {
  status:boolean=false;
  token:any;
 
 
 

  constructor(private router:Router,private loginservice:LoginService,private toastService: ToastrService,private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.token= this.route.snapshot.queryParamMap.get('token');
    console.log(this.token);
   
  }
  submit(password:any){
    this.status=true;
    let resetPassword={
      token:this.token,
      password:password
    }
    this.loginservice.resetpassword(resetPassword).subscribe(data=>{
      console.log(data);
      if(data.status==200){
        this.toastService.info("success","Password Successfully Updated And Saved!")
        this.status=false;
        setTimeout(() => {
          this.router.navigate([""])
          
        }, 4000);

      }else{
        this.toastService.error("error","Cannot Update Password")
      }

    })

 
  }
  routeToLogin(){
    this.router.navigate([''])

  }
}
