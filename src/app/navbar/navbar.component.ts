import { Component, OnInit } from '@angular/core';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { NavbarService } from '../navbar.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  userType:any;
  userName:any;
  constructor( private toastService: ToastrService,public service:ApplicantServiceService,public navbarService:NavbarService) { }

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('username');
    this.userType = sessionStorage.getItem('userType');
  
  }
  

}
