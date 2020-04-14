import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { NavbarService } from '../navbar.service';
import { Candidate, ViewCandidateObject } from '../candidate-profile/candidate';
import { reject } from 'q';
import { resolve } from 'path';

@Component({
  selector: 'app-view-candidate-profile',
  templateUrl: './view-candidate-profile.component.html',
  styleUrls: ['./view-candidate-profile.component.css']
})
export class ViewCandidateProfileComponent implements OnInit {
  firstname: any;
  lastname: any;
  candidateObj:any;
  name:any;
  userId: string;
  candidateId:any;
  reviewBtn: any;
  companyDetailsWithReviews:Array<any>=[];

  public constructor(private activatedRoute: ActivatedRoute,private service:ApplicantServiceService,public nav:NavbarService) {
   
  }

  ngOnInit(): void {

    

    this.nav.showNav();
    this.getParams();
    this.catchParams().then((result)=>{
        if(result){
          this.getCandidateProfile(this.userId,this.candidateId);
        }
    },(error)=>{
      console.log(error);
    })
   
  
  }

 
  ngAfterViewInit(){

  }
  getCandidateProfile(userId,candidateId) {
    this.service.getCandidateProfileForView(userId,candidateId).subscribe(d => {
      const { result: { candidateProfile, companiesWithReviewDTOList, alreadyGivenReview}}= d;
      const { id,field,imageContentType,resumeContentType,presentationLetter,dp,cv,user:{id:userId,name,email}} = candidateProfile;
      this.candidateObj = {id, field, imageContentType, resumeContentType, presentationLetter, dp, cv,userId, name, email }
      this.reviewBtn = alreadyGivenReview;
      this.companyDetailsWithReviews = companiesWithReviewDTOList
      

    })
  }
  goToReviewSection() {
    document.getElementById("review").scrollIntoView();
  }

 
  
  catchParams():Promise<any>{
    return new Promise(function(resolve,reject){
      resolve(true);
      });
    }


    getParams(){
      this.activatedRoute.queryParamMap.subscribe((params) => {
      this.userId = params.get('userId');
      this.candidateId=params.get('candId');
    });
    }



  getMIMEtype(extn) {
    let ext = extn.toLowerCase();
    let MIMETypes = {
      'text/plain': 'txt',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
      'application/msword': 'doc',
      'application/pdf': 'pdf',
      'image/jpeg': 'jpg',
      'image/bmp': 'bmp',
      'image/png': 'png',
      'application/vnd.ms-excel': 'xls',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
      'application/rtf': 'rtf',
      'application/vnd.ms-powerpoint': 'ppt',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx'
    }
    return MIMETypes[ext];
  }

  downloadFile() {

    const extension = this.getMIMEtype(this.candidateObj['resumeContentType']);
    const source = "data:" + extension + ";base64," + this.candidateObj["cv"];
    const downloadLink = document.createElement("a");
    const fileName = this.candidateObj.name+"." + extension;

    downloadLink.href = source;
    downloadLink.download = fileName;
    downloadLink.click();
    //const url= window.URL.createObjectURL(blob);
    //window.open(url);
  }
   
    postReview(review:String){
      let obj = {
        review:review,
        rating:0,
        candidateId:this.candidateId,
        jobId:0,
        ratedBy:sessionStorage.getItem('userType')

      }
      this.service.postReviewAgainstCandidate(obj).subscribe(res=>{
        console.log("tHIS IS THE RESPONSE",res);
        if(res.status==200){
          this.companyDetailsWithReviews = res.result ? res.result : '';
          this.reviewBtn = true;
        }
        
      })

    }
}
  
