import { Component, OnInit } from '@angular/core';
import { ApplicantServiceService } from '../Services/applicant-service.service'
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router'
import { CompanyProfile } from '../company-profile/companyProfile'
import { NavbarService } from '../navbar.service';
import { Subject } from 'rxjs';
import {DomSanitizer} from '@angular/platform-browser';
@Component({
  selector: 'app-company-profile-details',
  templateUrl: './company-profile-details.component.html',
  styleUrls: ['./company-profile-details.component.css']
})
export class CompanyProfileDetailsComponent implements OnInit {

  reviewBtn: any;
  companyId: any;
  companyReviewRating: Array<any> = [];
  companyDetails: Object;
  companyProfile: CompanyProfile;
  avgRating: number = 0;
  comments: any = 0;
  rating: any = 0;
  userType = sessionStorage.getItem('userType');
  userId = sessionStorage.getItem('userId');
  textReviewTab = true;
  videoReviewFile: any;

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
  resume: any;
  contentType: string;
  friendShipStatus: any;

  friendRequestsObservable = new Subject<string>();
  mySubscription;
  constructor(private sanitizer: DomSanitizer,private router: Router, private service: ApplicantServiceService, private activatedRoute: ActivatedRoute, private navbar: NavbarService) {
    this.companyProfile = new CompanyProfile();

    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
      }
    });
  }
  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.userType = sessionStorage.getItem('userType');
    this.navbar.showNav();
    this.companyProfile.contactName = sessionStorage.getItem('username');

    this.companyId = this.activatedRoute.snapshot.params.id;
    this.getFriendshipStatus(this.userId, this.companyId);
    this.getCompanyProfileDetails(this.companyId);

  }

  getCompanyProfileDetails(id): void {
    this.service.getCompanyProfile(id).subscribe((res) => {
      console.log(res)
      this.avgRating = res.avgRating;
      this.companyProfile = res.companyProfile;
      this.companyProfile.contactName = sessionStorage.getItem('username');
      this.resume = "data:" + this.getMIMEtype(this.companyProfile['resumeContentType']) + ";base64," + encodeURI(this.companyProfile["resume"])
      this.certificate = "data:" + this.getMIMEtype(this.companyProfile['certificateContentType']) + ";base64," + encodeURI(this.companyProfile["certificate"])
      this.companyReviewRating = res.companyReviewRatingDTOList;
      this.comments = this.companyReviewRating.length;
      this.reviewBtn = res.alreadyCommented;
      console.log(this.companyReviewRating);
    })

  }

  getMIMEtype(extn) {
    let ext = extn;
    let MIMETypes = {
      'text/plain': "txt",
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': "docx",
      'application/msword': "doc",
      'application/pdf': "pdf",
      'image/jpeg': "jpg",
      'image/bmp': "bmp",
      'image/png': "png",
      'application/vnd.ms-excel': "xls",
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': "xlsx",
      'application/rtf': "rtf",
      'application/vnd.ms-powerpoint': "ppt",
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': "pptx"
    }
    console.log(MIMETypes['application/' + ext])
    return 'application/' + MIMETypes['application/' + ext]
  }


  postReview(review: string) {
  
const formData=new FormData();
    formData.append("candidateId",this.userId)
    formData.append("review",review)
    formData.append("rating",this.rating)
    formData.append("companyId",this.companyId)
    formData.append("candidateId",this.userId)
    formData.append("type","text")

    // console.table(obj)

    this.service.isAlreadyCommentedOnCompanyProfile(formData).subscribe((res) => {
      // this.avgRating = res.result?res.result
      if (res.status == 200) {
        this.companyReviewRating = res.result ? res.result : this.companyReviewRating;
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

  videoReviewChanged(input) {
    console.log(input)
    if (input.target.files[0]) {
      let file = input.target.files[0];
      this.videoReviewFile = file;
      console.log(file)
    }
  }
  postVideoReview() {

    if(this.videoReviewFile)
    {
      const formData=new FormData();
      formData.append("candidateId",this.userId)
      formData.append("video",this.videoReviewFile)
      formData.append("rating",this.rating)
      formData.append("companyId",this.companyId)
      formData.append("candidateId",this.userId)
      formData.append("type","video")
      this.service.isAlreadyCommentedOnCompanyProfile(formData).subscribe((res) => {
        // this.avgRating = res.result?res.result
        if (res.status == 200) {
          this.companyReviewRating = res.result ? res.result : this.companyReviewRating;
          this.avgRating = res.result ? res.rating : this.avgRating;
          this.comments = this.companyReviewRating.length;
          this.reviewBtn = true;
          console.log(res);
        }
  
      });
    }
  }

sanitizeUrl(url){
  return this.sanitizer.bypassSecurityTrustResourceUrl(url)
}

  //modalWork

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





  //FRIEND REQUEST

  getFriendshipStatus(userId, friendId) {

    this.service.getFriendshipStatus(userId, friendId, "employer").subscribe((res) => {
      this.friendShipStatus = res;
      console.log(res)
    }, err => console.log(err))
  }

  addFriend() {
    this.service.sendFriendRequest(this.userId, this.companyProfile.id, "employer")
      .subscribe((res) => {
        console.log(res)
        this.friendRequestsObservable.next()
        this.getFriendshipStatus(this.userId, this.companyProfile.id)
      })
  }

  acceptRequest() {
    this.service.acceptRequest(this.userId, this.companyProfile.id, "employer")
      .subscribe(() => {
        this.friendRequestsObservable.next()
        this.getFriendshipStatus(this.userId, this.companyProfile.id)
      })
  }

  cancelRequest() {
    this.service.cancelFriendRequest(this.userId, this.companyProfile.id, "employer")
      .subscribe((res) => {
        console.log(res)
        this.friendRequestsObservable.next()
        this.getFriendshipStatus(this.userId, this.companyProfile.id)
      })
  }

}
