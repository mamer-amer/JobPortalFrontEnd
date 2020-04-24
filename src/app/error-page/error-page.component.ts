import { Component, OnInit, ViewChild } from '@angular/core';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { NavbarService } from '../navbar.service';
import { IImage } from 'ng-simple-slideshow';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent implements OnInit {

  userType;
  
  constructor(public service: ApplicantServiceService, private navbar: NavbarService) { }
  
  ngOnInit(): void {
    // this.userTypes = [
    //   { value: 'employer', viewValue: 'Employer' },
    //   { value: 'candidate', viewValue: 'Candidate' },
    //   { value: 'recruiter', viewValue: 'Recruiter' },
    // ];
    this.navbar.showNav()
    this.userType = sessionStorage.getItem('userType');
  }

  clear() {
    sessionStorage.clear();
  }
}
