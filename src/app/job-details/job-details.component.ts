import { Component, OnInit, ElementRef, Renderer2, HostListener } from '@angular/core';
import { ApplicantServiceService } from '../Services/applicant-service.service'
import { ActivatedRoute, NavigationEnd } from '@angular/router';
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
  candidateId: any=0;
  jobId: any;
  isSpinning = true;
  userId = sessionStorage.getItem('userId');
  // rating , review
  tooltips = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

  rating:any;
  review: String;
  btnApplied = false;
  rating2: any = 0;
  alreadyCommented = true;
  mySubscription;


  constructor( private toastService: ToastrService,private route: Router, public service: ApplicantServiceService, private activatedRoute: ActivatedRoute, private el: ElementRef, private renderer: Renderer2, private navbar: NavbarService) {
    this.jobObj = new JobDetails();

    this.route.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this.mySubscription = this.route.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.route.navigated = false;
      }
    });
  }
  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

  ngOnInit(): void {


    this.navbar.showNav();
    this.userType = sessionStorage.getItem('userType');
    let { id } = this.activatedRoute.snapshot.params;
    this.jobId = id;
    this.getJobById(id);
    this.getOtherCompanyJobs(id);

  }

 


  getJobById(id): void {

    this.service.getJobById(id).subscribe((res) => {
      this.jobObj = res.result;
      // console.log(this.jobObj)
      this.jobId = res.result.id;
      this.companyId = res.result.user.profile ? res.result.user.profile.id : null;
     
      this.alreadyAppliedJobsAgainstUser(this.userId, this.jobId);
      // this.postRatingAndReview(undefined);
     if(this.userType!="candidate"){
       this.displayCount(id);
     } 
     


      // once get the job also get the rating againts its company

    },error=> this.toastService.error('Error','Something went wrong'));

  }

  getOtherCompanyJobs(id): void {
    this.service.getJobCompany().subscribe((e) => {
      console.log(e)
      this.otherJobsArray = e;
    });
  }




  showDialog() {

    this.review = "";
    // this.rating = 0;
    this.rating2 = 0;

  }

  apply_for_job(): void {
    let obj = {
      "candidateId": this.userId,
      "jobId": this.jobId,
      "review": this.review,
      "rating": this.rating,
      "companyId": this.companyId
    }

  

    this.service.applyJob(obj).subscribe(res => {
      console.log(res);
      
      if(res.status==200){
        this.toastService.info('Successful', 'Successfully applied to the job!')
        this.btnApplied = true;
        // this.getCompanyRating(this.companyId); // this.companyId = res.result?res.result.companyProfile.id:0;
        this.alreadyCommented = true;
      }
      else if(res.status==500){
        
        this.toastService.error('Error', 'Something went wrong!');
      }
      else if(res.status==400){
          this.btnApplied = true;
      }
   
     
      

    },err=>  this.toastService.error('Error','Something went wrong!'));

  }



  // getCompanyRating(id: any): void {
  //   console.log(id)
  //   this.service.getReviewsById(id).subscribe(res => {
      
  //     this.rating = res.result;
     
     
  //     this.alreadyAppliedJobsAgainstUser(this.candidateId, this.jobId);
  //   },error=> this.toastService.error('Error','Something went wrong'));
  // }


  alreadyAppliedJobsAgainstUser(userId, jobId) {
    if(this.userType=="candidate"){
      this.service.isAlreadyApplied(userId, jobId).subscribe(res => {
        console.log("Btn applied disabled ? "+res.result)
        this.btnApplied = res.result;
      });
    }
  
  }


  postRatingAndReview(value:String) {


    if (this.userType == "candidate") {
      let obj = {
        "candidateId": this.candidateId,
        "jobId": this.jobId,
        "review": this.review,
        "rating": this.rating2,
        "companyId": this.companyId
      }
      this.service.isAlreadyCommentedOnCompanyProfile(obj).subscribe((res) => {
          console.log("Is already comment",res)
        if (res.status == 200 || res.status == 208) {
          this.alreadyCommented = true;
        
          if(value=="posting"){
            this.toastService.success('Thankyou for your time');
           this.rating = res.rating;
          }


          // disable
        }
        else {
          this.alreadyCommented = false;
        }

      }),error=>{
        this.alreadyCommented = false;
      }
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

