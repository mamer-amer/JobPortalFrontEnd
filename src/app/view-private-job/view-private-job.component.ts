import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { NavbarService } from '../navbar.service';
import { JobService } from '../Services/job.service';
import { Job } from '../Job';
import { CompanyProfileDetailsComponent } from '../company-profile-details/company-profile-details.component';
import { CompanyProfile } from '../company-profile/companyProfile';
import * as moment from 'moment';

@Component({
  selector: 'app-view-private-job',
  templateUrl: './view-private-job.component.html',
  styleUrls: ['./view-private-job.component.css']
})
export class ViewPrivateJobComponent implements OnInit {

  userType = sessionStorage.getItem('userType');
  jobId:any;
  allCandidatesReferedOrNotList : Array<any> = [];
  recruiterJobs:Job;
  companyProfile:CompanyProfile;
  applied  = false;
  tooltips = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
  publishFrom: string;
  publishTo: string;
  referJobDto:any;
  candidateProfiles: any[] = [];
 candidateId =sessionStorage.getItem('candidateId');


  constructor(private toastService: ToastrService, private route: Router, public service: ApplicantServiceService, private activatedRoute: ActivatedRoute, private el: ElementRef, private renderer: Renderer2, private navbar: NavbarService,private jobService:JobService) {

  }
    

  ngOnInit(){
    this.navbar.showNav();
    this.catchParams().then(jobId=>{
        this.callWithRespectToUser(jobId);
    })     
  }


  showToCandidateJobDetails(id){
    this.jobService.getJobDetailsForCandidate(id).subscribe(res => {
        if(res!=null){
          this.allCandidatesReferedOrNotList = res['result']['allCandidatesReferedOrNotList'];
          this.recruiterJobs = res['result']['recruiterJobs'];
          this.companyProfile = res['result']['recruiterJobs']['companyProfile']
          this.publishFrom = this.transform(this.recruiterJobs.publishFrom);
          let date = new Date(this.recruiterJobs.publishTo);
          this.publishTo = date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear();
          this.applied = res['already'] == null ? false : res['already'];
          this.referJobDto = {
            "companyId":this.companyProfile.id,
            "jobId": this.recruiterJobs['id'],
            "candidateId":this.candidateId
          }
         

        }  
    })
  }
  showToRecruiterJobDetails(id){
      this.jobService.getJobDetailsForRecruiter(id).subscribe(res=>{
        if (res != null) {
          // this.candidateProfiles = null;
          this.allCandidatesReferedOrNotList = res['result']['allCandidatesReferedOrNotList'];
          // if(this.allCandidatesReferedOrNotList.length<=0){
          //   this.candidateProfiles = res['result']['candidateProfiles'];
          //   console.log(this.candidateProfiles);
          // }
          this.recruiterJobs = res['result']['recruiterJobs'];
          this.companyProfile = res['result']['recruiterJobs']['companyProfile']
          this.applied = res['already'] == null ? false : res['already'];
          this.publishFrom = this.transform(this.recruiterJobs.publishFrom);
          let date = new Date(this.recruiterJobs.publishTo);
          this.publishTo = date.getDate()+'-'+date.getMonth()+'-'+date.getFullYear();
          this.referJobDto = {
            "companyId": this.companyProfile.id,
            "jobId": this.recruiterJobs['id'],
            "candidateId": this.candidateId
          }
          
        
        

        } 
      });
  }


  catchParams(){
    return new Promise((resolve,reject)=>{
      this.activatedRoute.params.subscribe(id => this.jobId = id.id);
      if(this.jobId)resolve(this.jobId);
      else reject();
    })
  }


  callWithRespectToUser(id){
    if(this.userType=="candidate"){
        this.showToCandidateJobDetails(id)
    }
    else{
        this.showToRecruiterJobDetails(id);
    }
  }


  print(value:any){
    console.log(value);
  }

  transform(date: any){
    const modifiedDate = moment(new Date(date)).fromNow();
    console.log(modifiedDate)
    return `${modifiedDate}`

  }

  isVisible = false;
  isOkLoading = false;

  showModal(): void {
    this.isVisible = true;

  }

  handleOk(): void {
    this.isOkLoading = true;
      if(this.candidateProfilesIds.length>0){
        this.jobService.referJob(this.referJobDto).subscribe(res => {
            console.log(res);
          if (res.status==200) {
            this.allCandidatesReferedOrNotList = res['result'];
            this.isVisible = false;
            this.isOkLoading = false;
            this.toastService.success('Successfull');
            this.referJobDto.candidateProfilesIds = null;

            }
          else {
            this.toastService.error("Error", 'Failed to refer a job')
            this.isOkLoading = false;

          }

        }),error=>{
          this.toastService.error("Error", 'Failed to refer a job')
          this.isOkLoading = false;
        }
      }

      else{
        this.isVisible = false;
      }
      
    
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  candidateProfilesIds = []
  

  referCandidatesList(candidateId){
     let alreadyPresent = this.candidateProfilesIds.find(id=>id==candidateId)
    alreadyPresent==undefined?this.candidateProfilesIds.push(candidateId):true;
    // console.log(this.referJobDto);
  }

  applyOnJob(){
    this.jobService.applyOnPrivateJob(this.referJobDto).subscribe(res=>{
      if(res.status==200){
        this.applied = true;
        this.toastService.info('Successfull');
      }
    })
  }

  undoRefer(candId){
    this.referJobDto = {
      "companyId": this.companyProfile.id,
      "jobId": this.recruiterJobs['id'],
      "candidateId": candId
    }
    this.jobService.undoReferToCandidate(this.referJobDto['jobId'],candId).subscribe(res=>{
      this.allCandidatesReferedOrNotList = res['result']['allCandidatesReferedOrNotList'];
      
    })
  }


}
