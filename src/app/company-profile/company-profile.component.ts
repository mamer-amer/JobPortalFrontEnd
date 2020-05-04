import { Component, OnInit } from '@angular/core';
import { CompanyProfile } from './companyProfile';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { NavbarService } from '../navbar.service';
import {NavbarComponent} from '../navbar/navbar.component'
import { Subject } from 'rxjs';
import { LoginService } from '../login-page/login.service';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent implements OnInit {

  loadingText= "loading..";
  logoChangeObservable=new Subject<string>();
  logoMessage=this.logoChangeObservable.asObservable();
  legalCompanyNameObserable = new Subject<string>();
  legalCompanyName = this.legalCompanyNameObserable.asObservable();
 
  


  companyProfileObj:CompanyProfile = new CompanyProfile();
  userId:any;
  constructor(public service:ApplicantServiceService,private toastService:ToastrService,private spinner:NgxSpinnerService,private loginService:LoginService,
    private navbar:NavbarService) { 
  }

  ngOnInit() {
    this.navbar.showNav();
    // this.spinner.show();
    this.checkUserId();
    this.getProfile();
    // this.getJobsPostedByEmployeeId();
  }

  submitCompanyProfile(){
   console.log(this.companyProfileObj)
    this.service.postCompanyProfile(this.userId,this.companyProfileObj).subscribe(res=>{
      if(res){
        sessionStorage.setItem('dp', this.companyProfileObj.logo);
        sessionStorage.setItem('companyId', res.result.id);
        sessionStorage.setItem('companyName',this.companyProfileObj.name);
        this.loginService.sendId.next(sessionStorage.getItem('companyId'));
        this.legalCompanyNameObserable.next();
        this.logoChangeObservable.next();   
      
        this.toastService.info('Successfull','Company Profile Posted')
      }
      else{
        this.toastService.error('Unsuccessfull', 'Company Profile Failed')

      }
      console.log(res);
    })

  }

  _handleReaderImageLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    let base64textString = btoa(binaryString);
  
    this.companyProfileObj.logo = base64textString;
    sessionStorage.removeItem('dp');
    sessionStorage.setItem('dp',this.companyProfileObj.logo);
    this.logoChangeObservable.next();

  }

  onImageChange(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.onload = this._handleReaderImageLoaded.bind(this);
      this.companyProfileObj.logoContentType = file.type
    
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


  getProfile(){
    this.service.getCurrentProfileUserStauts(this.userId).subscribe(res=>{
      this.loadingText = "Getting Profile.."
      if(res.status==200 && res.result!=null){
        this.companyProfileObj.id = sessionStorage.setItem('companyId',res.result.id)
      
        this.loginService.sendId.next(sessionStorage.getItem('companyId'));
        this.companyProfileObj = res.result ? res.result : new CompanyProfile();
        sessionStorage.setItem('dp', this.companyProfileObj.logo);
        sessionStorage.setItem('companyName', this.companyProfileObj.name);
        this.legalCompanyNameObserable.next();
        
        this.logoChangeObservable.next();

      }
     
      
   
     
    }),error=>{
      // this.spinner.hide();
      
    }
  }

 

  

}
