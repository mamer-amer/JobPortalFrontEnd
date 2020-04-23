import { Component, OnInit } from '@angular/core';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { NavbarService } from '../navbar.service';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent implements OnInit {

  userType;
  userTypes :Array<any>;
  selectedValue:any;
  constructor(public service:ApplicantServiceService,private navbar:NavbarService) { }

  ngOnInit(): void {
    this.userTypes = [
      { value: 'employer', viewValue: 'Employer' },
      { value: 'candidate', viewValue: 'Candidate' },
      { value: 'recruiter', viewValue: 'Recruiter' },
    ];
    this.navbar.showNav()
    this.userType = sessionStorage.getItem('userType');
  }

  clear(){
    sessionStorage.clear();
  }
}
