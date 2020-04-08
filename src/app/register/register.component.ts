import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Register } from './Register';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { NzMessageService } from 'ng-zorro-antd';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  repeatPassword:any;
  registerObj: Register = new Register();
  showLoading: boolean;
 

  constructor( private toastService: ToastrService,private router:Router,private service: ApplicantServiceService, private message: NzMessageService) { }

  ngOnInit(): void {
  }

  
  

  routeToLogin(){
    this.router.navigate([""])
  }
  
  registerUser(){
    sessionStorage.clear()
    this.registerObj.active = true;

    this.service.registerUser(this.registerObj).subscribe(d=>{
     
      if(d.status == 200){
        this.toastService.info('Successfull','User successfully registered')
        this.routeToLogin();
      }
      else{
        this.toastService.error('Unsuccessful','Something went wrong!')
      }
     
    },err=> this.toastService.error('Unsuccessful','Something went wrong!'))

  }

  RouterAccortingTocheckUserType({userType}:any){
    if(userType=="candidate"){
      this.router.navigate(['/candidateProfile'])
    }
    else if (userType == "employee"){
      this.router.navigate(['/employeeProfile']);
    }
    else{
      //do something
    }
  }




}
