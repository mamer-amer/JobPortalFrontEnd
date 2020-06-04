import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { NavbarService } from '../navbar.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { JobService } from '../Services/job.service';
import { ToastrService } from 'ngx-toastr';

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



  public constructor(public sanitizer: DomSanitizer, private activatedRoute: ActivatedRoute, private service: ApplicantServiceService, private toastService: ToastrService,public nav: NavbarService, private jobService: JobService) {
    this.candidateObj = new CadnidateWithReview();
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
      console.log(this.candidateObj, "==========")
      this.cv = "data:" + this.getMIMEtype(this.candidateObj['resumeContentType']) + ";base64," + encodeURI(this.candidateObj["cv"]);
      console.log(this.cv)
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
      "docx": 'docx',
      "pdf":'application/pdf',
      "doc":"doc"
    }
    return MIMETypes[ext];
  }



  downloadFile() {

    const extension =this.candidateObj['resumeContentType'];
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



  // pageChange(p): void {
  //   this.allJobs = []
  //   this.total = 0;
  //   this.itemsPerPage = 0;
  //   this.page = 0;
   

  //     this.getRecruiterJobs(p-1);
  

  // }

  pageChange(value:string): void {
    this.allJobs = []
    this.total = 0;
    this.itemsPerPage = 0;

    if(value=="next"){
      this.page = this.page + 1
      this.next = true;
      this.previous = false;
    }
    else if(value=="previous" && this.page>0){
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


  getRecruiterJobThatAreNotReffered(p){
    this.service.getNotRefferdJobs(this.candidateId,this.companyId,p).subscribe(response=>{
    
      if (response.result!=null) {

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
        setTimeout(function(){
            this.empty = true;
        },1000)
      }
    })
  }


  show = false;
  isOkLoading = false;

  referJob(){
    this.show = true;
    // this.getRecruiterJobs(0);
    this.getRecruiterJobThatAreNotReffered(0);


  }

  cancel(){
      this.show = false;
      this.isOkLoading = false;
  }

  save(jobId:any,candId:any){

    this.referJobDto = {
      "companyId": this.companyId,
      "jobId":jobId,
      "candidateId":candId
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