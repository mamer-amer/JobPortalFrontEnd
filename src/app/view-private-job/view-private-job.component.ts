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
  recruiterJobs:any;
  companyProfile:CompanyProfile;
  applied  = false;
  tooltips = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
  publishFrom: string;
  publishTo: string;
  userId = sessionStorage.getItem('userId');
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


  showJobDetails(id){
    this.jobService.getJobDetailsForCandidate(id).subscribe(res => {

      console.log(res);
        if(res!=null){
          this.recruiterJobs = res;
            this.companyProfile = res['user']['profile']
            this.companyProfile.id = res['user'].id;
            this.publishFrom = this.transform(this.recruiterJobs.publishFrom);
            let date = new Date(this.recruiterJobs.publishTo);
            this.publishTo = date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear();
            this.allCandidatesReferedOrNotList = res['appliedForRecruiterJobs'];
            if(this.userType=="candidate"){
              // search 
              this.alreadyApplied(this.userId,id)

            }
           
        }
        
    })
  }
  
  catchParams(){
    return new Promise((resolve,reject)=>{
      this.activatedRoute.params.subscribe(id => this.jobId = id.id);
      if(this.jobId)resolve(this.jobId);
      else reject();
    })
  }

  alreadyApplied(userId,jobId){
    this.service.checkAlreadyAppliedOnPrivateJob(userId,jobId).subscribe(res=>{
      this.applied = res;
    })
  }

  callWithRespectToUser(id){
    this.showJobDetails(id)
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

    
    this.referJobDto = {
      "companyId": this.companyProfile.id,
      "jobId": this.recruiterJobs['id'],
      "candidateId": sessionStorage.getItem('userId')
    }
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
        if(res['status']=200){
          this.callWithRespectToUser(this.referJobDto['jobId'])
        }
        else{
          this.toastService.warning('Something went wrong',"Try again")
        }
      
    })
  }


}
