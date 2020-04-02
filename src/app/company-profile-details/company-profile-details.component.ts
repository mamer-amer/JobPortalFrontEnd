import { Component, OnInit } from '@angular/core';
import { ApplicantServiceService } from '../Services/applicant-service.service'
import { ActivatedRoute } from '@angular/router'
import {CompanyProfile} from '../company-profile/companyProfile'

@Component({
  selector: 'app-company-profile-details',
  templateUrl: './company-profile-details.component.html',
  styleUrls: ['./company-profile-details.component.css']
})
export class CompanyProfileDetailsComponent implements OnInit {

  companyId:number;
  companyReviewRating:Array<any>=[];
  companyDetails:Object;
  companyProfile:CompanyProfile;
  avgRating:number=0;
  
  // rating , review
  tooltips = ['terrible', 'bad', 'normal', 'good', 'wonderful'];


  constructor(private service: ApplicantServiceService, private activatedRoute: ActivatedRoute) {
    this.companyProfile=new CompanyProfile();

   }

  ngOnInit(): void {


    this.companyId = this.activatedRoute.snapshot.params.id;

    this.getCompanyProfileDetails(this.companyId);
    
  }

  getCompanyProfileDetails(id):void{
    this.service.getCompanyProfile(id).subscribe((res) => {
      console.log(res)
      this.avgRating=res.avgRating;
     this.companyProfile=res.companyProfile;
      this.companyReviewRating=res.companyReviewRatingDTOList;
    })
  }

}
