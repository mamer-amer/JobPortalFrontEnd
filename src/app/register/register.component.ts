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
  status = false;
  repeatPassword:any;
  registerObj: Register = new Register();
  showLoading: boolean;
 

  constructor( private toastService: ToastrService,private router:Router,private service: ApplicantServiceService, private message: NzMessageService) { }

  ngOnInit(): void {
  }

  
  

  
  registerUser(){
    sessionStorage.clear()
    this.registerObj.active = true;
    this.status = true;
    this.service.registerUser(this.registerObj).subscribe(d=>{
     
      if(d.status == 200){
        
        this.toastService.info('Successfull','User successfully registered')
        this.status = false;
        this.routeToLogin();
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




