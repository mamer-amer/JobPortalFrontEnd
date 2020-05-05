import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CompanyProfile } from './companyProfile';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';

import { NavbarService } from '../navbar.service';
import {NavbarComponent} from '../navbar/navbar.component'
import { Subject } from 'rxjs';
import { LoginService } from '../login-page/login.service';
import { ImageTransform, ImageCroppedEvent, base64ToFile, Dimensions } from 'ngx-image-cropper';

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


  zoomvalue: any = 50;
  checkZoomInOrOut = this.zoomvalue;

  imageChangedEvent: any = '';
  croppedImage: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};
  @ViewChild('openModal', { static: true }) openModal: ElementRef










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




 


  imageLoaded() {
    this.showCropper = true;
    console.log('Image loaded');
  }

  cropperReady(sourceImageDimensions: Dimensions) {
    console.log('Cropper ready', sourceImageDimensions);
  }

  loadImageFailed() {
    console.log('Load failed');
  }

  rotateLeft() {
    this.canvasRotation--;
    this.flipAfterRotate();
  }

  rotateRight() {
    this.canvasRotation++;
    this.flipAfterRotate();
  }

  private flipAfterRotate() {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH
    };
  }


  flipHorizontal() {
    this.transform = {
      ...this.transform,
      flipH: !this.transform.flipH
    };
  }

  flipVertical() {
    this.transform = {
      ...this.transform,
      flipV: !this.transform.flipV
    };
  }

  resetImage() {
    this.scale = 1;
    this.rotation = 0;
    this.canvasRotation = 0;
    this.transform = {};
  }

  zoomOut() {
    this.scale -= .1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }

  zoomIn() {
    this.scale += .1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }


  zoom() {
    if (this.zoomvalue > this.checkZoomInOrOut) {
      this.checkZoomInOrOut = this.zoomvalue
      this.zoomIn();
    }
    else if (this.zoomvalue < this.checkZoomInOrOut) {
      this.checkZoomInOrOut = this.zoomvalue
      this.zoomOut();
    }
    console.log(this.transform)
  }

  toggleContainWithinAspectRatio() {
    this.containWithinAspectRatio = !this.containWithinAspectRatio;
  }

  updateRotation() {
    this.transform = {
      ...this.transform,
      rotate: this.rotation
    };
  }
















  fileChangeEvent(event: any): void {
    this.openModal.nativeElement.click();
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64.replace(/^data:image\/[a-z]+;base64,/, "");
    

  }




updateCroppedImage(){
  this.companyProfileObj.logo = this.croppedImage;
  sessionStorage.removeItem('dp');
  sessionStorage.setItem('dp', this.companyProfileObj.logo);
  this.logoChangeObservable.next();
  // console.log(event, base64ToFile(event.base64));
  // base64 to blob file
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
      // reader.onload = this._handleReaderImageLoaded.bind(this);
      this.fileChangeEvent(event);
      this.companyProfileObj.logoContentType = file.type;
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
