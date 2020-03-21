import { Component, OnInit } from '@angular/core';
import { CompanyProfile } from './companyProfile';
import { ApplicantServiceService } from '../Services/applicant-service.service';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent implements OnInit{


  companyProfileObj:CompanyProfile = new CompanyProfile();
  constructor(private service:ApplicantServiceService) { }

  ngOnInit(): void {
  }

  submitCompanyProfile(){
    console.log(this.companyProfileObj);
    this.service.postCompanyProfile(this.companyProfileObj).subscribe(res=>{
      console.log(res);
    })

  }

  _handleReaderImageLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    let base64textString = btoa(binaryString);
    //console.log(btoa(binaryString));
    this.companyProfileObj.profileLogo = base64textString;

  }

  onImageChange(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.onload = this._handleReaderImageLoaded.bind(this);
      this.companyProfileObj.imageContentType = file.type
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

}
