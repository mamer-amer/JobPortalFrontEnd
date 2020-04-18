import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { NavbarService } from '../navbar.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-view-candidate-profile',
  templateUrl: './view-candidate-profile.component.html',
  styleUrls: ['./view-candidate-profile.component.css']
})
export class ViewCandidateProfileComponent implements OnInit {
  firstname: any;
  lastname: any;
  candidateObj: CadnidateWithReview;
  name: any;
  userId: any;
  cv: any;
  candidateId: any;
  isVisible: boolean = false;
  reviewBtn: any;
  companyDetailsWithReviews: Array<any> = [];
  rating: any = 0;
  userType: any;
  tooltips = ['terrible', 'bad', 'normal', 'good', 'wonderful'];



  public constructor(public sanitizer: DomSanitizer, private activatedRoute: ActivatedRoute, private service: ApplicantServiceService, public nav: NavbarService) {

  }

  ngOnInit(): void {

    this.userType = sessionStorage.getItem('userType');

    this.nav.showNav();
    this.getParams();
    this.catchParams().then((result) => {
      if (result) {
        this.getCandidateProfile(this.userId, this.candidateId);
      }
    }, (error) => {
      console.log(error);
    })


  }


  ngAfterViewInit() {

  }
  getCandidateProfile(userId, candidateId) {
    this.service.getCandidateProfileForView(userId, candidateId).subscribe(d => {
      const { result: { candidateProfile, companiesWithReviewDTOList, alreadyGivenReview, rating } } = d;
      const { id, field, imageContentType, resumeContentType, presentationLetter, dp, cv, user: { id: userId, name, email } } = candidateProfile;
      this.candidateObj = { id, field, imageContentType, resumeContentType, presentationLetter, dp, cv, userId, name, email, rating }
      this.reviewBtn = alreadyGivenReview;
      this.companyDetailsWithReviews = companiesWithReviewDTOList

      this.cv = "data:" + this.candidateObj['resumeContentType'] + ";base64," + encodeURI(this.candidateObj["cv"])
    })
  }
  goToReviewSection() {
    document.getElementById("review").scrollIntoView();
  }



  catchParams(): Promise<any> {
    return new Promise(function (resolve, reject) {
      resolve(true);
    });
  }


  getParams() {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.userId = params.get('userId') != null ? params.get('userId') : 0;
      this.candidateId = params.get('candId') != null ? params.get('candId') : 0;
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
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
      "docx": 'docx'
    }
    return MIMETypes[ext];
  }



  downloadFile() {

    const extension = this.getMIMEtype(this.candidateObj['resumeContentType']);
    const source = "data:" + extension + ";base64," + this.candidateObj["cv"];
    const downloadLink = document.createElement("a");
    const fileName = this.candidateObj.name + "." + extension;
    downloadLink.href = source;
    downloadLink.download = fileName;
    downloadLink.click();

  }

  postReview(review: String) {
    let obj = {
      review: review,
      rating: this.rating,
      candidateId: this.candidateId,
      jobId: 0,
      ratedBy: sessionStorage.getItem('userType')

    }
    this.service.postReviewAgainstCandidate(obj).subscribe(res => {
      console.log("tHIS IS THE RESPONSE", res);
      if (res.status == 200) {
        this.candidateObj.rating = 0;
        this.companyDetailsWithReviews = res.result ? res.result : '';
        this.candidateObj.rating = res.rating ? res.rating : 0;
        this.reviewBtn = true;
      }

    })

  }


  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
}

interface CadnidateWithReview {
  id?: any;
  field?: any;
  imageContentType?: any;
  resumeContentType?: any;
  presentationLetter?: any;
  dp?: any;
  cv?: any;
  userId?: any;
  name?: any;
  email?: any;
  rating?: any;

}