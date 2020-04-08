import { Component, OnInit, ElementRef, Renderer2, HostListener } from '@angular/core';
import { ApplicantServiceService } from '../Services/applicant-service.service'
import { ActivatedRoute } from '@angular/router';
import { JobDetails } from '../job-details/JobDetails'
import { Router } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner';
import { NavbarService } from '../navbar.service';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.css']
})

export class JobDetailsComponent implements OnInit {

  numOfCandidates:any = 0;
  jobObj: JobDetails;
  otherJobsArray: Array<any> = [];
  userType: any;
  display = false;
  companyId: Number;
  candidateId: any=0;
  jobId: any;
  isSpinning = true;

  // rating , review
  tooltips = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

  rating = 0;
  review: String;
  btnApplied = false;
  rating2: any = 0;
  alreadyApplied = true;



  constructor(private route: Router, public service: ApplicantServiceService, private activatedRoute: ActivatedRoute, private el: ElementRef, private renderer: Renderer2, private spinner: NgxSpinnerService,private navbar:NavbarService) {
    this.jobObj = new JobDetails();


  }

  ngOnInit(): void {


    this.navbar.showNav();
    this.userType = sessionStorage.getItem('userType');
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
      console.log(this.jobObj)
      this.jobId = res.result.id;
      this.companyId = res.result.companyProfile ? res.result.companyProfile.id : null;
      this.getCompanyRating(this.companyId);
      // this.alreadyAppliedJobsAgainstUser(this.candidateId, this.jobId);
      this.postRatingAndReview();
      this.displayCount(id);


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
    if(this.userType=="candidate"){
      this.service.isAlreadyApplied(canId, jobId).subscribe(res => {
        this.btnApplied = res.result;
      });
    }
    else{
      return;
    }
   

  }


  postRatingAndReview() {
    // console.table(this.jobObj);

    if (this.userType == "candidate") {
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

      });
    }
    else {
      this.spinner.hide();
      return;
    }



  }


  routeToComapnyProfile(): void {
    this.route.navigate(['companyProfileDetails/'+this.companyId])
  }


  displayCount(id:any){
    this.service.getCountOfCandidates(id).subscribe((res=>{
        console.log("Count of candidiares",res.result)
        this.numOfCandidates = parseInt(res.result);
    }),error=>{
      console.log(error);
    }
    );
  }


  routeToCandidatesProfiles(){
    this.route.navigate(['/appliedcandidates/'+this.jobId])
  }


}

