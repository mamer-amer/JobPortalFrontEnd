import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { NavbarService } from '../navbar.service';
import { ToastrService } from 'ngx-toastr';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  userType:any;
  userName:any;
  userImage:any;
  userId:any;
  constructor(private toastService: ToastrService, public service: ApplicantServiceService, public navbarService: NavbarService, private nzMessageService: NzMessageService) { }

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('username');
    this.userType = sessionStorage.getItem('userType');
    this.userId = sessionStorage.getItem('userId');
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
