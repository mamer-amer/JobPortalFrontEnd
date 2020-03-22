import { Component, OnInit } from '@angular/core';
import { CompanyProfile } from './companyProfile';
import { ApplicantServiceService } from '../Services/applicant-service.service';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent implements OnInit {


  companyProfileObj:CompanyProfile = new CompanyProfile();
  userId:any;
  constructor(public service:ApplicantServiceService) { }

  ngOnInit() {
    this.checkUserId();
    this.getEmployeeProfile();
    // this.getJobsPostedByEmployeeId();
  }

  submitCompanyProfile(){
    this.service.postCompanyProfile(this.userId,this.companyProfileObj).subscribe(res=>{
      console.log(res);
    })

  }

  _handleReaderImageLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    let base64textString = btoa(binaryString);
    //console.log(btoa(binaryString));
    this.companyProfileObj.logo = base64textString;

  }

  onImageChange(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.onload = this._handleReaderImageLoaded.bind(this);
      this.companyProfileObj.logoContentType = file.type
      //console.log("1"+this.appFormObj.resumeContentType)
      reader.readAsBinaryString(file);

    }
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

  checkUserId() {
    const id = sessionStorage.getItem('userId');
    if (id != null) {
      this.userId = id;
    }

  }

  getJobsPostedByEmployeeId() {
    this.checkUserId();
    this.service.getJobsByEmployeeId(this.userId).subscribe(res => {
      console.table(res);
    })
  }

  getEmployeeProfile(){
    this.service.getCurrentProfileUserStauts(this.userId).subscribe(res=>{
      this.companyProfileObj = res.companyProfile ? res.companyProfile :new CompanyProfile();
      // console.log("yeh company profile dega" + res ? res.companyProfile:null)
    })
  }

  

}
