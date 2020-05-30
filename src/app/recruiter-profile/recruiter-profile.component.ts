

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {ApplicantServiceService} from '../Services/applicant-service.service'
import { ImageCroppedEvent, Dimensions, ImageTransform } from 'ngx-image-cropper';
import { NavbarService } from '../navbar.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../login-page/login.service';
import { Subject } from 'rxjs';
import RecruiterProfile from './RecruiterProfile';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
@Component({
  selector: 'app-recruiter-profile',
  templateUrl: './recruiter-profile.component.html',
  styleUrls: ['./recruiter-profile.component.css']
})
export class RecruiterProfileComponent implements OnInit {

  loadingText = "loading..";
  logoChangeObservable = new Subject<string>();
  logoMessage = this.logoChangeObservable.asObservable();
  legalCompanyNameObserable = new Subject<string>();
  legalCompanyName = this.legalCompanyNameObserable.asObservable();
  userType = sessionStorage.getItem('userType')



  recruiterProfileObj: RecruiterProfile = new RecruiterProfile();
  userId: any;

  resume: any;
  zoomvalue: any = 1;
  checkZoomInOrOut = this.zoomvalue;

  imageChangedEvent: any = '';
  croppedImage: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};
  @ViewChild('openModal', { static: true }) openModal: ElementRef;
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true
  };
  previewImage: string | undefined = '';
  previewVisible = false;
  certificate: any;
  contentType: string;











  constructor(public service: ApplicantServiceService, private toastService: ToastrService, private spinner: NgxSpinnerService, private loginService: LoginService,
    private navbar: NavbarService,private _snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.navbar.showNav();
    this.spinner.show();
    this.checkUserId();
   
  }

  

  openSnackBar() {
    this._snackBar.open('Please complete your profile before posting ', 'End now', {
      duration: 7500,
      horizontalPosition: "left",
      verticalPosition: "bottom",
    });
  }

  submitRecruiterProfile() {
    console.log(this.recruiterProfileObj)
    this.service.postRecruiter(this.userId, this.recruiterProfileObj).subscribe(res => {
      if (res) {

        sessionStorage.setItem('dp', this.recruiterProfileObj.logo);
        sessionStorage.setItem('recruiter_id', res.result.id);
        this.logoChangeObservable.next();
        

        this.toastService.info('Successfull', 'Company Profile Posted')
      }
      else {
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








  resetImage() {
    this.scale = 1;
    this.rotation = 0;
    this.canvasRotation = 0;
    this.transform = {};
  }




  zoom(a) {

    this.zoomvalue = a;
    this.transform = {
      ...this.transform,
      scale: this.zoomvalue
    };
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
    this.zoomvalue = 1;
    this.openModal.nativeElement.click();
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64.replace(/^data:image\/[a-z]+;base64,/, "");
    console.log(event, "=======")

  }

  onFileChange1(event) {

    let reader = new FileReader();

    try {
      if (event.target.files && event.target.files.length > 0) {
        let file = event.target.files[0];
        if (this.fileExtensionAllowed(file.name)) {
          this.recruiterProfileObj.resumeContentType = this.getFileExtension(file.name)

          reader.onload = this._handleReaderLoaded_1.bind(this);


          reader.readAsBinaryString(file);
        }
        else this.toastService.error('Unsuccessful', 'Candidate Profile failed');


      }
    }
    catch (error) {
      console.log(error);
    }
  }
  onFileChange2(event) {

    let reader = new FileReader();

    try {
      if (event.target.files && event.target.files.length > 0) {
        let file = event.target.files[0];
        if (this.fileExtensionAllowed(file.name)) {
          this.recruiterProfileObj.certificateContentType = this.getFileExtension(file.name)

          reader.onload = this._handleReaderLoaded_2.bind(this);


          reader.readAsBinaryString(file);
        }
        else this.toastService.error('Unsuccessful', 'Candidate Profile failed');


      }
    }
    catch (error) {
      console.log(error);
    }
  }



  _handleReaderLoaded_1(readerEvt) {
    var binaryString = readerEvt.target.result;
    let base64textString = btoa(binaryString);
    //console.log(btoa(binaryString));
    this.recruiterProfileObj.resume = base64textString;

    this.resume = "data:" + this.getMIMEtype(this.recruiterProfileObj['resumeContentType']) + ";base64," + encodeURI(this.recruiterProfileObj["resume"])

  }
  _handleReaderLoaded_2(readerEvt) {
    var binaryString = readerEvt.target.result;
    let base64textString = btoa(binaryString);
    //console.log(btoa(binaryString));
    this.recruiterProfileObj.certificate = base64textString;

    this.certificate = "data:" + this.getMIMEtype(this.recruiterProfileObj['certificateContentType']) + ";base64," + encodeURI(this.recruiterProfileObj["certificate"])

  }

  getFileExtension = (filename) => filename.split('.').pop();

  fileExtensionAllowed(filename) {


    let extensionsAllowed = {
      "doc": true,
      "docx": true,
      "pdf": true
    }
    let ext = this.getFileExtension(filename)



    return extensionsAllowed[ext];
  }



  updateCroppedImage() {
    this.recruiterProfileObj.logo = this.croppedImage;
    sessionStorage.removeItem('dp');
    sessionStorage.setItem('dp', this.recruiterProfileObj.logo);
    this.logoChangeObservable.next();
    // console.log(event, base64ToFile(event.base64));
    // base64 to blob file
  }




  _handleReaderImageLoaded(readerEvt) {

    var binaryString = readerEvt.target.result;
    let base64textString = btoa(binaryString);

    this.recruiterProfileObj.logo = base64textString;
    sessionStorage.removeItem('dp');
    sessionStorage.setItem('dp', this.recruiterProfileObj.logo);
    this.logoChangeObservable.next();

  }

  onImageChange(event) {

    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      // reader.onload = this._handleReaderImageLoaded.bind(this);
      this.fileChangeEvent(event);
      this.recruiterProfileObj.logoContentType = file.type;
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
      this.recruiterProfileObj.id = this.userId;
      this.getProfile();
    }

  }


  getProfile() {
    this.service.getCurrentProfileUserStauts(this.userId).subscribe(res => {
      if (res!=null) {
        
     
        if (res.recruiterProfile!=null){
          
          this.recruiterProfileObj = res.recruiterProfile ? res.recruiterProfile : new RecruiterProfile();
          sessionStorage.setItem('dp', this.recruiterProfileObj.logo);
          this.certificate = "data:" + this.getMIMEtype(this.recruiterProfileObj['certificateContentType']) + ";base64," + encodeURI(this.recruiterProfileObj["certificate"])
          this.resume = "data:" + this.getMIMEtype(this.recruiterProfileObj['resumeContentType']) + ";base64," + encodeURI(this.recruiterProfileObj["resume"])
          this.logoChangeObservable.next(); 
        }
        else{
          this.openSnackBar();
        }
      

      }




    }), error => {
      // this.spinner.hide();

    }
  }

  downloadFile() {

    const extension = this.recruiterProfileObj['resumeContentType'];
    const source = this.value;
    const downloadLink = document.createElement("a");
    const fileName = this.recruiterProfileObj.name + "." + extension;
    downloadLink.href = source;
    downloadLink.download = fileName;
    downloadLink.target = "_blank"
    downloadLink.click();

  }



  isVisible = false;
  value: string;


  showModal(): void {
    this.isVisible = true;
    this.resume = "data:" + this.getMIMEtype(this.recruiterProfileObj['resumeContentType']) + ";base64," + encodeURI(this.recruiterProfileObj["resume"])
    this.value = this.resume;
    this.contentType = this.recruiterProfileObj['resumeContentType'];

  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  // isVisibleCertificate = false;

  showModalCertificate(): void {
    this.isVisible = true;
    this.certificate = "data:" + this.getMIMEtype(this.recruiterProfileObj['certificateContentType']) + ";base64," + encodeURI(this.recruiterProfileObj["certificate"])
    this.value = this.certificate;
    this.contentType = this.recruiterProfileObj['certificateContentType'];
  }

}
