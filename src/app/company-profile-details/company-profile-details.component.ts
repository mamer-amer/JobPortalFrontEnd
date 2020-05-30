import { Component, OnInit } from '@angular/core';
import { ApplicantServiceService } from '../Services/applicant-service.service'
import { ActivatedRoute } from '@angular/router'
import {CompanyProfile} from '../company-profile/companyProfile'
import { NavbarService } from '../navbar.service';
import RecruiterProfile from '../recruiter-profile/RecruiterProfile';
import { type } from 'os';

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
  recruiterProfile:RecruiterProfile;
  avgRating:number=0;
  comments:any=0;
  rating:any=0;
  userType=sessionStorage.getItem('userType');
  userId = sessionStorage.getItem('userId');
  recruiterUserId:any;
  // rating , review
  tooltips = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true
  };
  previewImage: string | undefined = '';
  previewVisible = false;
  certificate: any;
  resume:any;
  contentType: string;
  type:any;


  constructor(private service: ApplicantServiceService, private activatedRoute: ActivatedRoute,private navbar:NavbarService) {
    this.companyProfile=new CompanyProfile();

   }

  ngOnInit(): void {
    this.userType = sessionStorage.getItem('userType');
    this.navbar.showNav();
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.type = params.get("type");
    });
    if(this.type=="companyPorfile"){
      this.companyId = this.activatedRoute.snapshot.params.id;
      this.getCompanyProfileDetails(this.companyId);
    }
    else if(this.type="recruiterProfile"){
      this.recruiterUserId = this.activatedRoute.snapshot.params.id;
    }
    
    
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


  getRecruiterProfileDetails(){
    //1- complete recruiterProfile
    // 2-Avg rating;
    // 3-All candidates with reviews and ratings 
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



  downloadFile() {

    const extension = this.contentType;
    const source = this.value;
    const downloadLink = document.createElement("a");
    const fileName = this.companyProfile.name + "." + extension;
    downloadLink.href = source;
    downloadLink.download = fileName;
    downloadLink.target = "_blank"
    downloadLink.click();

  }



  isVisible = false;
  value: string;


  showModal(): void {
    this.isVisible = true;
    this.resume = "data:" + this.getMIMEtype(this.companyProfile['resumeContentType']) + ";base64," + encodeURI(this.companyProfile["resume"])
    this.value = this.resume;
    this.contentType = this.companyProfile['resumeContentType'];

  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  isVisibleCertificate = false;

  showModalCertificate(): void {
    this.isVisible = true;
    this.certificate = "data:" + this.getMIMEtype(this.companyProfile['certificateContentType']) + ";base64," + encodeURI(this.companyProfile["certificate"])
    this.value = this.certificate;
    this.contentType = this.companyProfile['certificateContentType'];
  }

 




}
