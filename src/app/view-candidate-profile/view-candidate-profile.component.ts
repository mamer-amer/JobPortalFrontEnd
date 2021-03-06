import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, NavigationEnd } from '@angular/router';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { NavbarService } from '../navbar.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { JobService } from '../Services/job.service';
import { ToastrService } from 'ngx-toastr';
import { NzModalService } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import $ from 'jquery'
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
  total: any;
  page: number = 0;
  itemsPerPage: any;
  allJobs: any = [];
  empty: boolean;
  companyId = sessionStorage.getItem('companyId');
  referJobDto: { "companyId": any; "jobId": any; "candidateId": any; };
  previous: boolean = false;
  next: boolean = false;
  friendShipStatus;
  id = sessionStorage.getItem("userId");
  textReviewTab = true;
  friendRequestsObservable = new Subject<string>();
  mySubscription;
  videoReviewFile;
  isReviewEdit: boolean = false;
  invitationIsVisible=true;
  review;



  public constructor( private router: Router, public sanitizer: DomSanitizer, private activatedRoute: ActivatedRoute, private service: ApplicantServiceService, private toastService: ToastrService, public nav: NavbarService, private jobService: JobService, private modalService: NzModalService) {
    this.candidateObj = new CadnidateWithReview();

    //modal
    let that=this;
    $('#myModal').on('shown.bs.modal', function () {
      // that.loadMap()
      $('#myInput').trigger('focus')
    })

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
 
   


    this.nav.showNav();
    this.getParams();
    this.catchParams().then((result) => {
      if (result) {
        console.log(result, "========candidae")
        this.getCandidateProfile(this.userId, this.candidateId);

      }
    }, (error) => {
      console.log(error);
    })


  }


 
  getCandidateProfile(userId, candidateId) {
    this.service.getCandidateProfileForView(userId, candidateId).subscribe(d => {

      console.log(d, "=======")
      if (d.message == "profilenotcompleted") {
        this.candidateObj = d.result;
        console.log(d, "=======")
        this.candidateId = this.candidateObj.id;
        this.getFriendshipStatus(this.id, this.candidateId);

      }
      else if (d.message == "Successfull") {
        const { result: { candidateProfile, companiesWithReviewDTOList, alreadyGivenReview, rating } } = d;
        const { id, field, imageContentType, resumeContentType, presentationLetter, dp, cv, user: { id: userId, name, email } } = candidateProfile;
        this.candidateObj = { id, field, imageContentType, resumeContentType, presentationLetter, dp, cv, userId, name, email, rating }
        this.reviewBtn = alreadyGivenReview;
        this.companyDetailsWithReviews = companiesWithReviewDTOList;
      companiesWithReviewDTOList.map((c) => {
          if (c.userId == this.id) {
            this.rating = c.rating,
              this.review = c.review
          }
        })
        console.log(companiesWithReviewDTOList,"===rating")
        console.log(this.review,"----treviee")
        console.log(this.candidateObj, "==========")
        this.cv = "data:" + this.getMIMEtype(this.candidateObj['resumeContentType']) + ";base64," + encodeURI(this.candidateObj["cv"]);
        this.candidateId = d.result.candidateProfile.id;
        console.log(d)
        this.getFriendshipStatus(this.id, this.candidateId);
      }

    });
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
      "docx": 'docx',
      "pdf": 'application/pdf',
      "doc": "doc"
    }
    return MIMETypes[ext];
  }




  downloadFile() {

    const extension = this.candidateObj['resumeContentType'];
    const source = "data:" + extension + ";base64," + this.candidateObj["cv"];
    const downloadLink = document.createElement("a");
    const fileName = this.candidateObj.name + "." + extension;
    downloadLink.href = source;
    downloadLink.download = fileName;
    downloadLink.click();

  }

  postReview(review) {

    const formData = new FormData();
    formData.append("candidateId", this.candidateId)
    formData.append("review", review)
    formData.append("rating", this.rating)
    formData.append("ratedBy", sessionStorage.getItem('userType'))
    formData.append("type", "text")



    // let obj = {
    //   review: review,
    //   rating: this.rating,
    //   candidateId: this.candidateId,
    //   jobId: 0,
    //   ratedBy: sessionStorage.getItem('userType')

    // }
    this.service.postReviewAgainstCandidate(formData).subscribe(res => {
      console.log("tHIS IS THE RESPONSE", res);
      if (res.status == 200) {
        this.candidateObj.rating = 0;
        this.companyDetailsWithReviews = res.result ? res.result : '';
        this.candidateObj.rating = res.rating ? res.rating : 0;
        this.reviewBtn = true;
      }

    })

  }
  moveArrayElementToFirst(arr, index) {

    let obj = arr[index];
    let tempArray = arr;
    tempArray.splice(index, 1);
    tempArray.splice(0, 0, obj);
    return tempArray;
  }
  deleteReview(id) {
    this.service.deleteReview(id)
      .subscribe(() => {
        this.getCandidateProfile(this.userId, this.candidateId);
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
        this.getCandidateProfile(this.userId, this.candidateId);
        this.isReviewEdit = false;
      })
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
      const formData = new FormData();
      formData.append("candidateId", this.candidateId)
      formData.append("video", this.videoReviewFile)
      formData.append("rating", this.rating)
      formData.append("type", "video");
      formData.append("ratedBy", sessionStorage.getItem("userType"))
      this.service.postReviewAgainstCandidate(formData).subscribe(res => {
        console.log("tHIS IS THE RESPONSE", res);
        if (res.status == 200) {
          this.candidateObj.rating = 0;
          this.companyDetailsWithReviews = res.result ? res.result : '';
          this.candidateObj.rating = res.rating ? res.rating : 0;
          this.reviewBtn = true;
        }

      })
    }
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



  // pageChange(p): void {
  //   this.allJobs = []
  //   this.total = 0;
  //   this.itemsPerPage = 0;
  //   this.page = 0;


  //     this.getRecruiterJobs(p-1);


  // }

  pageChange(value: string): void {
    this.allJobs = []
    this.total = 0;
    this.itemsPerPage = 0;

    if (value == "next") {
      this.page = this.page + 1
      this.next = true;
      this.previous = false;
    }
    else if (value == "previous" && this.page > 0) {
      this.page = this.page - 1;
      this.previous = true
      this.next = false;
    }


    this.getRecruiterJobThatAreNotReffered(this.page);


  }


  getRecruiterJobs(p) {

    this.service.getJobsByCompanyPrivate(p, this.companyId).subscribe(response => {

      console.log(response, "======jobs by company")
      if (response.totalElements > 0) {

        this.total = response.totalElements;
        // this.page = p + 1;
        this.itemsPerPage = response.size;
        this.allJobs = response.content
        this.empty = false;
      }
      else {
        // this.page = response.pageable.pageNumber + 1;
        this.total = response.totalElements;
        this.empty = true;
        setTimeout(function () {
          this.empty = false;
        }, 1000)
      }
    });
  }


  getRecruiterJobThatAreNotReffered(p) {
    this.service.getNotRefferdJobs(this.candidateId, this.companyId, p).subscribe(response => {

      if (response.result != null) {

        // this.total = response.totalElements;
        // this.page = p;
        this.itemsPerPage = 5;
        this.allJobs = response.result
        this.empty = false;
      }
      else {
        // this.page = 1;
        // this.total = response.totalElements;
        this.empty = true;
        setTimeout(function () {
          this.empty = true;
        }, 1000)
      }
    })
  }


  show = false;
  isOkLoading = false;

  referJob() {
    this.show = true;
    // this.getRecruiterJobs(0);
    this.getRecruiterJobThatAreNotReffered(0);


  }

  cancel() {
    this.show = false;
    this.isOkLoading = false;
  }

  save(jobId: any, candId: any) {

    this.referJobDto = {
      "companyId": this.companyId,
      "jobId": jobId,
      "candidateId": candId
    }

    console.log(this.referJobDto)

    this.isOkLoading = true;
    this.jobService.referJob(this.referJobDto).subscribe(res => {
      console.log(res);
      if (res.status == 200) {


        this.isOkLoading = false;
        this.toastService.info('Successfull');
        this.show = false;



      }
      else {
        this.toastService.error("Error", 'Failed to refer a job')
        this.isOkLoading = false;

      }

    }), error => {
      this.toastService.error("Error", 'Failed to refer a job')
      this.isOkLoading = false;
    }


  }


  refer = false;


  showReferConfirm(jobId, candId): void {
    this.modalService.confirm({
      nzTitle: 'Are you sure you want to refer this job?',
      nzContent: '<b style="color: red;">Press Ok to refer</b>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOnOk: () => {
        this.save(jobId, candId)

      },
      nzCancelText: 'No',
      nzOnCancel: () => {
        this.refer = false;
        console.log(this.refer);
        // window.history.go(-1);
      }
    });
  }
  //FRIEND REQUEST

  getFriendshipStatus(id, friendId) {

    this.service.getFriendshipStatus(id, friendId, "candidate").subscribe((res) => {
      this.friendShipStatus = res;
      console.log(res)
    }, err => console.log(err))
  }

  addFriend() {
    this.service.sendFriendRequest(this.id, this.candidateId, "candidate")
      .subscribe((res) => {
        console.log(res)
        this.friendRequestsObservable.next()
        this.getFriendshipStatus(this.id, this.candidateId)
      })
  }

  cancelRequest() {
    this.service.cancelFriendRequest(this.id, this.candidateId, "candidate")
      .subscribe((res) => {
        console.log(res)
        this.friendRequestsObservable.next()
        this.getFriendshipStatus(this.id, this.candidateId)
      })
  }
  acceptRequest() {
    this.service.acceptRequest(this.id, this.candidateId, "candidate")
      .subscribe(() => {
        this.friendRequestsObservable.next()
        this.getFriendshipStatus(this.id, this.candidateId)
      })
  }


gotoMeetingInvite(){
  this.router.navigate(['meeting-invite/'+this.userId])
}



}
class CadnidateWithReview {
  id?: any;
  field?: any;
  imageContentType?: any = "";
  resumeContentType?: any = "";
  presentationLetter?: any;
  dp?: any;
  cv?: any;
  userId?: any;
  name?: any;
  email?: any;
  rating?: any;

}