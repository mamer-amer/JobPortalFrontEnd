import { Component, OnInit } from '@angular/core';
import { ApplicantServiceService } from '../Services/applicant-service.service'
import { ActivatedRoute } from '@angular/router'
import {CompanyProfile} from '../company-profile/companyProfile'
import { NavbarService } from '../navbar.service';

@Component({
  selector: 'app-company-profile-details',
  templateUrl: './company-profile-details.component.html',
  styleUrls: ['./company-profile-details.component.css']
})
export class CompanyProfileDetailsComponent implements OnInit {

  reviewBtn:any;
  companyId:number;
  companyReviewRating:Array<any>=[];
  companyDetails:Object;
  companyProfile:CompanyProfile;
  avgRating:number=0;
  comments:any=0;
  rating:any=0;
  userType=sessionStorage.getItem('userType');
  userId = sessionStorage.getItem('userId');
  
  // rating , review
  tooltips = ['terrible', 'bad', 'normal', 'good', 'wonderful'];


  constructor(private service: ApplicantServiceService, private activatedRoute: ActivatedRoute,private navbar:NavbarService) {
    this.companyProfile=new CompanyProfile();

   }

  ngOnInit(): void {

    this.navbar.showNav();
    
    this.companyId = this.activatedRoute.snapshot.params.id;

    this.getCompanyProfileDetails(this.companyId);
    
  }

  getCompanyProfileDetails(id):void{
    this.service.getCompanyProfile(id).subscribe((res) => {
      console.log(res)
      this.avgRating=res.avgRating;
      this.companyProfile=res.companyProfile;
      this.companyReviewRating=res.companyReviewRatingDTOList;
      this.comments = this.companyReviewRating.length;
      this.reviewBtn = res.alreadyCommented;
      console.log(this.companyReviewRating);
    })
    
  }

  postReview(review:string){
    // here wer are saving userId in canidateId because we dont have candidateId in this page
    let obj = {
      "candidateId": this.userId,
      "jobId": 0,
      "review": review,
      "rating": this.rating,
      "companyId": this.companyId
    }

    console.table(obj)

    this.service.isAlreadyCommentedOnCompanyProfile(obj).subscribe((res) => {
      // this.avgRating = res.result?res.result
      if(res.status==200){
        this.companyReviewRating = res.result?res.result:this.companyReviewRating;
       this.avgRating = res.result ? res.rating : this.avgRating;
       this.comments = this.companyReviewRating.length;
       this.reviewBtn = true;
        console.log(res);
      }
     
    });
  }

}
