import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { ApplicantServiceService } from '../Services/applicant-service.service'
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router'
import { CompanyProfile } from '../company-profile/companyProfile'
import { NavbarService } from '../navbar.service';
import { Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-company-profile-details',
  templateUrl: './company-profile-details.component.html',
  styleUrls: ['./company-profile-details.component.css']
})
export class CompanyProfileDetailsComponent implements OnInit {

  reviewBtn: any = false;
  reviews: Array<any> = [];

  companyReviewRating: Array<any> = [];
  companyDetails: Object;
  companyProfile: CompanyProfile;
  avgRating: number = 0;
  comments: any = 0;
  rating: any = 0;
  userType = sessionStorage.getItem('userType');
  userId: any;
  textReviewTab = true;
  videoReviewFile: any;

  isReviewEdit: boolean = false;
  review;
  // rating;

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
  selfProfile = false;
  visitedUserId:any;
  visiterUserId:any;

  //visited user id  is the person who's profile is open 
  //visiter is the person who is currently logged in

  friendRequestsObservable = new Subject<string>();
  mySubscription;
  constructor(private sanitizer: DomSanitizer, private router: Router, private service: ApplicantServiceService,
    private activatedRoute: ActivatedRoute, private navbar: NavbarService, private toastService: ToastrService) {
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
    this.visitedUserId = this.activatedRoute.snapshot.params.id;
    this.navbar.showNav();
    this.selfProfile = this.visitedUserId==sessionStorage.getItem('userId')?true:false;
    this.companyProfile.contactName = sessionStorage.getItem('username');
    this.visiterUserId = sessionStorage.getItem('userId');
    this.getFriendshipStatus(this.visiterUserId,this.visitedUserId);
    this.getCompanyProfileDetails(this.visiterUserId);
    this.getReviews(this.visitedUserId)
    if (this.userType == "candidate") {
      this.visiterUserId = sessionStorage.getItem('userId');
      this.service.isAlreadyCommented(this.visiterUserId, this.visitedUserId).subscribe(res => {
        if (res == "Already_reported") {
          this.reviewBtn = true;
        }
        else {
          this.reviewBtn = false;
        }
      })
    }



  }

  getCompanyProfileDetails(id): void {
    this.service.getCompanyProfile(id).subscribe((res) => {
      console.log(res)
      
      this.companyProfile = res.profile;
      this.companyProfile.contactName = sessionStorage.getItem('username');
      this.resume = "data:" + this.getMIMEtype(this.companyProfile['resumeContentType']) + ";base64," + encodeURI(this.companyProfile["resume"])
      this.certificate = "data:" + this.getMIMEtype(this.companyProfile['certificateContentType']) + ";base64," + encodeURI(this.companyProfile["certificate"])
      // let index = res.companyReviewRatingDTOList.findIndex(r => r.userId == this.userId);

      // this.visitedUserId = res.userId;
      // console.log(res, "========ress")

      // if (index != -1) {
      //   this.review = res.companyReviewRatingDTOList[index].review;
      //   this.rating = res.companyReviewRatingDTOList[index].rating ? res.companyReviewRatingDTOList[index].rating : 0;
      //   this.companyReviewRating = this.moveArrayElementToFirst(res.companyReviewRatingDTOList, index);

      // }
      // else
      //   this.companyReviewRating = res.companyReviewRatingDTOList;

      // this.comments = this.companyReviewRating.length;
      // this.reviewBtn = res.alreadyCommented;
      // console.log(this.companyReviewRating);
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

    const formData = new FormData();
    formData.append("candidateId", this.visiterUserId)
    formData.append("review", review)
    formData.append("rating", this.rating)
    formData.append("companyId", this.visitedUserId)
    formData.append("type", "text")

    // console.table(obj)

    this.service.isAlreadyCommentedOnCompanyProfile(formData).subscribe((res) => {
      // this.avgRating = res.result?res.result
      console.log(res)
      if (res.status == 200) {

        let index = res.result.findIndex(r => r.userId == this.userId);


        if (index != -1) {
          this.review = res.result[index].review;
          this.rating = res.result[index].rating ? res.result[index].rating : 0;
          this.companyReviewRating = this.moveArrayElementToFirst(res.result, index);

        }
        else
          this.companyReviewRating = res.result ? res.result : this.companyReviewRating;

        this.avgRating = res.result ? res.rating : this.avgRating;
        this.comments = this.companyReviewRating.length;
        this.reviewBtn = true;
        this.getReviews(this.userId);

        console.log(res);
      }

    });
  }
  deleteReview(id) {
    this.service.deleteReview(id)
      .subscribe(() => {
        this.getCompanyProfileDetails(this.visitedUserId);
      })
  }

  updateReview(id, type) {
    let obj;
    if (type == 'text') {
      obj = new FormData();
      obj.append("rating", this.rating);
      obj.append("type", type);
      obj.append("review", this.review);
    }
    else {
      obj = new FormData();
      obj.append("rating", this.rating);
      obj.append("type", type);
      obj.append("video", this.videoReviewFile);
    }

    this.service.updateReview(id, obj)
      .subscribe(() => {
        this.getCompanyProfileDetails(this.visitedUserId);
        this.isReviewEdit = false;
      })
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

    if (this.videoReviewFile) {
      let formData = new FormData();
      formData.append("candidateId", this.visiterUserId)
      formData.append("video", this.videoReviewFile)
      console.log(this.rating, "==========rating")
      formData.append("rating", this.rating)
      formData.append("companyId", this.visitedUserId)
      formData.append("type", "video")
      this.service.isAlreadyCommentedOnCompanyProfile(formData).subscribe((res) => {
        // this.avgRating = res.result?res.result
        if (res.status == 200) {
          let index = res.result.findIndex(r => r.userId == this.userId);


          if (index != -1) {

            console.log(res.result[index].rating, "============")
            this.review = res.result[index].review;
            this.rating = res.result[index].rating ? res.result[index].rating : 0;
            console.log(this.rating, "============")
            this.companyReviewRating = this.moveArrayElementToFirst(res.result, index);

          }
          else
            this.companyReviewRating = res.result ? res.result : this.companyReviewRating;

          this.avgRating = res.result ? res.rating : this.avgRating;
          this.comments = this.companyReviewRating.length;
          this.reviewBtn = true;
          console.log(res);
        }

      });
    }
  }

  //modalWork

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


  moveArrayElementToFirst(arr, index) {

    let obj = arr[index];
    let tempArray = arr;
    tempArray.splice(index, 1);
    tempArray.splice(0, 0, obj);
    return tempArray;
  }
  gotoaddtender() {
    this.router.navigate(['addtender/' + this.visitedUserId + '/' + this.visiterUserId]);
  }


  //FRIEND REQUEST

  getFriendshipStatus(userId, friendId) {

    this.service.getFriendshipStatus(userId, friendId, "employer").subscribe((res) => {
      this.friendShipStatus = res;
      console.log(res)
    }, err => console.log(err))
  }

  addFriend() {
    console.log("visiterId==>"+this.visiterUserId+"==="+"visiteduserId==>"+this.visitedUserId);
    this.service.sendFriendRequest(this.visiterUserId, this.visitedUserId, "employer")
      .subscribe((res) => {
        console.log(res)
        this.friendRequestsObservable.next()
        this.getFriendshipStatus(this.visiterUserId, this.visitedUserId)
      })
  }

  acceptRequest() {
    this.service.acceptRequest(this.visiterUserId, this.visitedUserId, "employer")
      .subscribe(() => {
        this.friendRequestsObservable.next()
        this.getFriendshipStatus(this.visiterUserId, this.visiterUserId)
      })
  }

  cancelRequest() {
    this.service.cancelFriendRequest(this.visiterUserId, this.visitedUserId, "employer")
      .subscribe((res) => {
        console.log(res)
        this.friendRequestsObservable.next()
        this.getFriendshipStatus(this.visiterUserId, this.visitedUserId)
      })
  }

  sendInvite() {
    this.router.navigate(['meeting-invite/' + this.visitedUserId])
  }

  getReviews(userId) {
    this.reviews = []
    this.service.getReviewsDetails(userId).subscribe(res => {
      if (res.status = 200) {
        this.reviews = res.result;
        this.comments = res.result.length
      }
    })
  }

}
