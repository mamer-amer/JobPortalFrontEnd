import { Component, OnInit, ElementRef, Renderer2, HostListener } from '@angular/core';
import { ApplicantServiceService } from '../Services/applicant-service.service'
import { ActivatedRoute } from '@angular/router';
import { JobDetails } from '../job-details/JobDetails'
import { Router } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner';
import { NavbarService } from '../navbar.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.css']
})

export class JobDetailsComponent implements OnInit {

  numOfCandidates: any = 0;
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



  constructor( private toastService: ToastrService,private route: Router, public service: ApplicantServiceService, private activatedRoute: ActivatedRoute, private el: ElementRef, private renderer: Renderer2, private navbar: NavbarService) {
    this.jobObj = new JobDetails();


  }

  ngOnInit(): void {
    this.navbar.showNav();
    this.candidateId = Number(sessionStorage.getItem('candidateId'));
    this.userType = sessionStorage.getItem('userType');
    let { id } = this.activatedRoute.snapshot.params;
    this.jobId = id;
    this.getJobById(id);
    this.getOtherCompanyJobs(id);

  }


  getJobById(id): void {

    this.service.getJobById(id).subscribe((res) => {
      this.jobObj = res.result;
      this.jobId = res.result.id;
      this.companyId = res.result.companyProfile ? res.result.companyProfile.id : null;
      this.getCompanyRating(this.companyId);
      this.alreadyAppliedJobsAgainstUser(this.candidateId, this.jobId);
      this.postRatingAndReview();
      this.displayCount(id);


      // once get the job also get the rating againts its company

    },error=> this.toastService.error('Error','Something went wrong'));

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



    let obj = {
      "candidateId": this.candidateId,
      "jobId": this.jobId,
      "review": this.review,
      "rating": this.rating,
      "companyId": this.companyId
    }

  

    this.service.applyJob(obj).subscribe(res => {
      
      this.toastService.info('Successful','Successfully applied to the job!')
      this.companyId = res.result.companyProfile.id;
      this.getCompanyRating(this.companyId);

    },err=>  this.toastService.error('Error','Something went wrong!'));

  }



  getCompanyRating(id: any): void {
    this.service.getReviewsById(id).subscribe(res => {

      this.rating = res.result;
      this.alreadyAppliedJobsAgainstUser(this.candidateId, this.jobId);
    },error=> this.toastService.error('Error','Something went wrong'));
  }


  alreadyAppliedJobsAgainstUser(canId, jobId) {
    this.service.isAlreadyApplied(canId, jobId).subscribe(res => {
      this.btnApplied = res.result;


    },error=> this.toastService.error('Error','Something went wrong'));

  }


  postRatingAndReview() {


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


        // this.;

      });
    }
    else {

      return;
    }



  }


  routeToComapnyProfile(): void {
    this.route.navigate(['companyProfileDetails/' + this.companyId])
  }


  displayCount(id: any) {
    this.service.getCountOfCandidates(id).subscribe((res => {
      
      this.numOfCandidates = parseInt(res.result);
    }), error => {
      console.log(error);
    }
    );
  }


  routeToCandidatesProfiles() {
    this.route.navigate(['/appliedcandidates/' + this.jobId])
  }


}

