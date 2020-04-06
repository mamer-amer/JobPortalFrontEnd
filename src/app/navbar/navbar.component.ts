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
  constructor(public service:ApplicantServiceService,public navbarService:NavbarService) { }

  ngOnInit(): void {
    this.userType = sessionStorage.getItem('userType');
  
  }

}
