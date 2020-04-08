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

  public constructor(private activatedRoute: ActivatedRoute,private service:ApplicantServiceService,public nav:NavbarService) {
   
  }

  ngOnInit(): void {

    

    this.nav.showNav();
    this.getParams();
    this.catchParams().then((result)=>{
        if(result){
          this.getCandidateProfile(this.userId);
        }
    },(error)=>{
      console.log(error);
    })
   
  
  }

 
  ngAfterViewInit(){

  }
  getCandidateProfile(userId) {
    this.service.getCandidateProfileForView(userId).subscribe(d => {
      this.candidateObj = d;
      console.log(this.candidateObj);
      const { result: { id, field, resumeContentType, imageContentType, presenationLetter="No presenation Letter found", dp, cv, user: { name: username, email } } } = d
      this.candidateObj = { id, field, resumeContentType, imageContentType, presenationLetter, dp, cv, username, email }
      console.log(this.candidateObj);


    })
  }

 
  
  catchParams():Promise<any>{
    return new Promise(function(resolve,reject){
      resolve(true);
      });
    }


    getParams(){
      this.activatedRoute.queryParamMap.subscribe((params) => {
      this.userId = params.get('userId');
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
    const fileName = this.candidateObj.username+"." + extension;

    downloadLink.href = source;
    downloadLink.download = fileName;
    downloadLink.click();
    //const url= window.URL.createObjectURL(blob);
    //window.open(url);
  }
   

}
  
