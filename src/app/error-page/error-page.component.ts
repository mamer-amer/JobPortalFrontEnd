import { Component, OnInit } from '@angular/core';
import { ApplicantServiceService } from '../Services/applicant-service.service';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent implements OnInit {

  userType;
  constructor(public service:ApplicantServiceService) { }

  ngOnInit(): void {
    this.userType = sessionStorage.getItem('userType');
  }

}
