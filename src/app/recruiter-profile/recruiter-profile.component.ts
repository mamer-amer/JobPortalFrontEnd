

import { Component, OnInit } from '@angular/core';
import {ApplicantServiceService} from '../Services/applicant-service.service'
@Component({
  selector: 'app-recruiter-profile',
  templateUrl: './recruiter-profile.component.html',
  styleUrls: ['./recruiter-profile.component.css']
})
export class RecruiterProfileComponent implements OnInit {

  constructor(private service:ApplicantServiceService) { }

  ngOnInit(): void {
  }


  getRecruiterProfile(): void {
   
  }

}
