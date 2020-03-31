import { Component, OnInit, ElementRef, Renderer2, HostListener } from '@angular/core';
import { ApplicantServiceService } from '../Services/applicant-service.service'
import { ActivatedRoute } from '@angular/router';
import { JobDetails } from '../job-details/JobDetails'
import { retry } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

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
  isSpinning = true;
  
  // rating , review
  tooltips = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

  rating = 0;
  review: String;
  btnApplied = false;
  rating2: any = 0;
  alreadyApplied = true;



  constructor(public service: ApplicantServiceService, private activatedRoute: ActivatedRoute, private el: ElementRef, private renderer: Renderer2,private spinner:NgxSpinnerService) {
    this.jobObj = new JobDetails();


  }

  ngOnInit(): void {
    this.spinner.show();
    this.candidateId = Number(sessionStorage.getItem('candidateId'));
    this.userType = sessionStorage.getItem('userType');
    console.log(this.activatedRoute)
    let { id } = this.activatedRoute.snapshot.params;
    this.jobId = id;
    this.getJobById(id);
    this.getOtherCompanyJobs(id);
    // this.alreadyAppliedJobsAgainstUser(this.candidateId, this.jobId);


  }


  getJobById(id): void {
    this.spinner.show();
    this.service.getJobById(id).subscribe((res) => {

      this.jobObj = res.result;
      this.jobId = res.result.id;
      this.companyId = res.result.companyProfile ? res.result.companyProfile.id : null;
      this.getCompanyRating(this.companyId);
      this.alreadyAppliedJobsAgainstUser(this.candidateId, this.jobId);
      this.postRatingAndReview();
      

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
    this.rating2 = 0;

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
    
      this.rating = res.result;
      this.alreadyAppliedJobsAgainstUser(this.candidateId, this.jobId);
    });
  }


  alreadyAppliedJobsAgainstUser(canId, jobId) {
    this.service.isAlreadyApplied(canId, jobId).subscribe(res => {
      this.btnApplied = res.result;
      this.spinner.hide();

    });

  }


  postRatingAndReview() {
    // console.table(this.jobObj);
    
    if(this.userType=="candidate"){
      let obj = {
        "candidateId": this.candidateId,
        "jobId": this.jobId,
        "review": this.review,
        "rating": this.rating2,
        "companyId": this.companyId
      }
      this.service.isAlreadyCommentedOnCompanyProfile(obj).subscribe((res) => {

        if (res.status == 200 || res.status == 208) {
          this.alreadyApplied = true;
          

          // disable
        }
        else {
          this.alreadyApplied = false;
        }

         
        // this.;

      });
    }
    else{
      this.spinner.hide();
      return;
    }

  
    
  }


 


  // @HostListener('click') onMouseClick() {
  //   this.highlight('red');
  // }

  // private highlight(color: string) {
  //   this.el.nativeElement.style.background = color;
  //   console.log(this.el.nativeElement)
  // }
  
  }

  //  promise():Promise<any>{
  //  return new Promise((resolve,reject)=>{
  //   resolve(this.jobId!=null);
  //   }).then
  //  }
  // resolve runs the first function in .then  
  // On page refresh check for job applied and company reviews 
  // show reviews of every company
  // give review to the company after appliying on the job
  // show myJobs to employees only.


