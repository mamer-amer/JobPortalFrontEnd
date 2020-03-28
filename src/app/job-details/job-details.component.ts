import { Component, OnInit, ElementRef, Renderer2, HostListener } from '@angular/core';
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
  otherJobsArray: Array<any> = [];
  userType: any;
  display = false;
  companyId: Number;
  candidateId: any;
  jobId: any;
  // rating , review
  tooltips = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
  rating = 0;
  review: String;
  btnApplied = false;

  constructor(public service: ApplicantServiceService, private activatedRoute: ActivatedRoute, private el: ElementRef, private renderer: Renderer2) {
    this.jobObj = new JobDetails();


  }

  ngOnInit(): void {
    this.candidateId = Number(sessionStorage.getItem('candidateId'));
    this.userType = sessionStorage.getItem('userType');
    console.log(this.activatedRoute)
    let { id } = this.activatedRoute.snapshot.params;
    this.jobId = id;
    this.getJobById(id);
    this.getOtherCompanyJobs(id);
    this.alreadyAppliedJobsAgainstUser(this.candidateId, this.jobId);


  }


  getJobById(id): void {

    this.service.getJobById(id).subscribe((res) => {
      console.log("lol", res);
      this.jobObj = res.result;
      this.jobId = res.result.id;
      this.companyId = res.result.companyProfile ? res.result.companyProfile.id : null;
      this.getCompanyRating(this.companyId);
      this.alreadyAppliedJobsAgainstUser(this.candidateId, this.jobId);

      // once get the job also get the rating againts its company
     
    });

  }

  getOtherCompanyJobs(id): void {
    this.service.getJobCompany(id).subscribe((e) => {
      console.log(e)
      this.otherJobsArray = e;
    });
  }

 


  showDialog() {
    this.review = "";
    this.rating = 0;
  }

  apply_for_job(): void {

    // console.table(this.jobObj);
    let obj = {
      "candidateId": this.candidateId,
      "jobId": this.jobId,
      "review": this.review,
      "rating": this.rating,
      "companyId": this.companyId
    }

    this.service.applyJob(obj).subscribe(res => {
      console.log(res);
      this.companyId = res.result.companyProfile.id;
      this.getCompanyRating(this.companyId);
    });

  }



  getCompanyRating(id: any): void {
    this.service.getReviewsById(id).subscribe(res => {
      console.log("this is rating", res)
      this.rating = res.result;

    });
  }


  alreadyAppliedJobsAgainstUser(canId, jobId) {
    this.service.isAlreadyApplied(canId, jobId).subscribe(res => {
      this.btnApplied = res.result;

    })
  }

  //  promise():Promise<any>{
  //   return new Promise((resolve,reject)=>{
  //     resolve(this.jobId!=null);
  //   }).then
  //  }

  

// resolve runs the first function in .then


  
  // On page refresh check for job applied and company reviews 
  // show reviews of every company
  // give review to the company after appliying on the job
  // show myJobs to employees only.



}
