import { Component, OnInit } from '@angular/core';
import { ApplicantServiceService } from '../Services/applicant-service.service'
import { ActivatedRoute } from '@angular/router';
import { JobDetails } from '../job-details/JobDetails'

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.css']
})

export class JobDetailsComponent implements OnInit {

  jobObj: JobDetails;
  otherJobsArray:Array<any>=[];
  userType:any;
  

  constructor(public service: ApplicantServiceService, private activatedRoute: ActivatedRoute) {
    this.jobObj = new JobDetails();

   
  }

  ngOnInit(): void {
    this.userType = sessionStorage.getItem('userType');
    console.log(this.activatedRoute)
    let { id } = this.activatedRoute.snapshot.params;
    this.getJobById(id);
    this.getOtherCompanyJobs(id)
   
  }


  getJobById(id): void {
    this.service.getJobById(id).subscribe((res) => {
      console.log(res)
      this.jobObj = res.result;
    })
  }

  getOtherCompanyJobs(id):void {
    this.service.getJobCompany(id).subscribe((e) => {
      console.log(e)
      this.otherJobsArray=e;
    })
  }
}
