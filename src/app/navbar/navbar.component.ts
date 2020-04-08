import { Component, OnInit } from '@angular/core';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { NavbarService } from '../navbar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  userType:any;
  userName:any;
  constructor(public service:ApplicantServiceService,public navbarService:NavbarService) { }

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('username');
    this.userType = sessionStorage.getItem('userType');
  
  }

}
