import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Candidate } from './candidate';
import { Location } from '@angular/common';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { isNumber } from 'util';
import { ExportAsConfig, ExportAsService } from 'ngx-export-as';
// import { NzMessageService } from 'ng-zorro-antd';
import { ToastrService } from 'ngx-toastr';
import { UploadFile } from 'ng-zorro-antd/upload';
import { NavbarService } from '../navbar.service';
import { Subject } from 'rxjs';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { ImageTransform, Dimensions, ImageCroppedEvent } from 'ngx-image-cropper';
import { NavbarComponent } from '../navbar/navbar.component';
import { LoginService } from '../login-page/login.service';
@Component({
  selector: 'app-candidate-profile',
  templateUrl: './candidate-profile.component.html',
  styleUrls: ['./candidate-profile.component.css']
})
export class CandidateProfileComponent implements OnInit {

  logoChangeObservable = new Subject<string>();
  logoMessage = this.logoChangeObservable.asObservable();




  resume;
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true
  };
  previewImage: string | undefined = '';
  previewVisible = false;

  setCandidateId = new Subject<string>();
  getCandidateId = this.setCandidateId.asObservable();




  userId;
  labelText = "Upload your Resume";
  allJobsbtn: any = false;
  color: any = false;
  // exportAsConfig: ExportAsConfig = {
  //   type: 'pdf', // the type you want to download
  //   elementId: 'myTableElementId', // the id of html/table element
  // }
  candidateId: any;


  fields: any[] = [
    { value: "all", viewValue: "Show All Jobs" },
    { value: 'Business and Finance', viewValue: 'Business and Finance' },
    { value: 'Computers and Technology', viewValue: 'Computers and Technology' },
    { value: 'Contruction Trades', viewValue: 'Contruction Trades' },
    { value: 'Education, Teaching and Training', viewValue: 'Education, Teaching and Training' },
    { value: 'Engineering and Engineering Technicians', viewValue: 'Engineering and Engineering Technicians' },
    { value: 'Fishing, Farming and Forestry', viewValue: 'Fishing, Farming and Forestry' },
    { value: 'Legal, Criminal Justice and Law Enforcement', viewValue: 'Legal, Criminal Justice and Law Enforcement' },
    { value: 'Management', viewValue: 'Management' },
    { value: 'Media Communications and Broadcasting', viewValue: 'Media Communications and Broadcasting' },
    { value: 'Military and Armed Forces', viewValue: 'Military and Armed Forces' },
    { value: 'Office Administration and Management', viewValue: 'Office Administration and Management' },
    { value: 'Production and Manufacturing', viewValue: 'Production and Manufacturing' },
    { value: 'Installation, Repair and Maintenance', viewValue: 'Installation, Repair and Maintenance' },
    { value: 'Sales and Marketing', viewValue: 'Sales and Marketing' },
    { value: 'Social and Life Sciences', viewValue: 'Social and Life Sciences' },
    { value: 'Transportation and Moving', viewValue: 'Transportation and Moving' },

  ];


  candidateObj: Candidate = new Candidate();
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
  @ViewChild('openModal', { static: true }) openModal: ElementRef

  constructor(public sanitizer: DomSanitizer, private exportAsService: ExportAsService, private _location: Location, public service: ApplicantServiceService, private router: Router, private activateRoute: ActivatedRoute, private toastService: ToastrService, public nav: NavbarService, private loginService: LoginService) { }


  ngOnInit(): void {
    this.nav.showNav();
    this.checkUserStauts();



  }







  formValidation() {
    if (this.candidateObj.name && this.candidateObj.email && this.candidateObj.field && this.candidateObj.resume && this.candidateObj.presentationLetter && this.candidateObj.dp) {
      return false;
    }
    else {
      return true;
    }
  }


  goBack() {
    this._location.back();
  }



  imageLoaded() {
    this.showCropper = true;
    console.log('Image loaded');
  }

  cropperReady(sourceImageDimensions: Dimensions) {
    console.log('Cropper ready', sourceImageDimensions);
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




  fileChangeEvent(event: any): void {
    this.openModal.nativeElement.click();
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64.replace(/^data:image\/[a-z]+;base64,/, "");


  }




  updateCroppedImage() {
    sessionStorage.removeItem('dp');
    this.candidateObj.dp = this.croppedImage;
    sessionStorage.setItem('dp', this.candidateObj.dp);
    this.logoChangeObservable.next();
    // console.log(event, base64ToFile(event.base64));
    // base64 to blob file
  }


















  _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    let base64textString = btoa(binaryString);
    //console.log(btoa(binaryString));
    this.candidateObj.resume = base64textString;

    this.resume = "data:" + this.getMIMEtype(this.candidateObj['resumeContentType']) + ";base64," + encodeURI(this.candidateObj["resume"])

  }

  _handleReaderImageLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    let base64textString = btoa(binaryString);
    //console.log(btoa(binaryString));
    this.candidateObj.dp = base64textString;
    sessionStorage.removeItem('dp');
    sessionStorage.setItem('dp', this.candidateObj.dp);
    this.logoChangeObservable.next();


  }


  onFileChange(event) {

    let reader = new FileReader();

    try {
      if (event.target.files && event.target.files.length > 0) {
        let file = event.target.files[0];
        if (this.fileExtensionAllowed(file.name)) {
          this.candidateObj.resumeContentType = this.getFileExtension(file.name)

          reader.onload = this._handleReaderLoaded.bind(this);


          reader.readAsBinaryString(file);
        }
        else this.toastService.error('Unsuccessful', 'Candidate Profile failed');


      }
    }
    catch (error) {
      console.log(error);
    }
  }

  onImageChange(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      this.fileChangeEvent(event);
      // reader.onload = this._handleReaderImageLoaded.bind(this);
      this.candidateObj.dpContentType = file.type
      //console.log("1"+this.appFormObj.resumeContentType)
      reader.readAsBinaryString(file);



    }
  }




  updateProfile() {


    this.service.postCandidateProfile(this.userId, this.candidateObj).subscribe(res => {

      if (res.status == 200) {

        console.log("This is candidate response", res)
        this.toastService.info('Sucessful', 'Candidate profile posted!')
        this.allJobsbtn = true;
        this.labelText = "Change your resume"
        this.checkUserStauts()

      }
      else {
        this.toastService.error('Unsuccessful', 'This attachment type is not allowed');
      }

    });
  }




  checkUserStauts() {


    this.userId = sessionStorage.getItem("userId");
    this.service.getUser(this.userId).subscribe((res) => {
      console.log(res)
      this.candidateObj.name = res.name
      this.candidateObj.email = res.email
      if (res.profile) {

        this.candidateObj.field = res.profile.field;
        this.candidateObj.presentationLetter = res.profile.presentationLetter;
        this.candidateObj.resume = res.profile.resume;
        this.candidateObj.dp = res.profile.dp;
        sessionStorage.setItem('dp', this.candidateObj.dp);
        this.logoChangeObservable.next();
        this.candidateObj.dpContentType = res.profile.dpContentType;
        this.candidateObj.resumeContentType = res.profile.resumeContentType;
        this.resume = "data:" + this.getMIMEtype(this.candidateObj['resumeContentType']) + ";base64," + encodeURI(this.candidateObj["resume"])
       
      }
     

    })
    // if (this.userId != null) {
    //   //get the status of user

    //   this.service.getCurrentProfileUserStauts(this.userId).subscribe(res => {

    //     if (res != null) {
    //       //the profile is already present

    //       this.candidateObj.name = sessionStorage.getItem('username');
    //       this.candidateObj.email = sessionStorage.getItem('email');
    //       if (res.result != null) {
    //         this.candidateId = sessionStorage.setItem('candidateId', res.result.id)

    //         this.labelText = "Change your resume"
    //         this.color = true;
    //         this.allJobsbtn = true;
    //         this.candidateObj.field = res.result.field;
    //         this.candidateObj.presentationLetter = res.result.presentationLetter;
    //         this.candidateObj.cv = res.result.cv;
    //         this.candidateObj.dp = res.result.dp;
    //         sessionStorage.setItem('dp', this.candidateObj.dp);
    //         this.logoChangeObservable.next();

    //         this.candidateObj.imageContentType = res.result.imageContentType;
    //         this.candidateObj.resumeContentType = res.result.resumeContentType;

    //         this.cv = "data:" + this.getMIMEtype(this.candidateObj['resumeContentType']) + ";base64," + encodeURI(this.candidateObj["cv"])
    //         this.setCandidateId.next(this.candidateId);




    //       }
    //     }

    //     else {
    //       //the profile is not present

    //       this.candidateObj = new Candidate();
    //     }
    //   })

    // }
  }




  checkParams() {
    this.userId = this.activateRoute.snapshot.params['id'];
    if (!isNaN(this.userId)) {
      return this.userId;
    }
    else {
      return undefined
    }
  }




  logout() {
    sessionStorage.clear();
    this.router.navigateByUrl('');
  }


  getMIMEtype(extn) {
    let ext = extn
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
      'docx': 'docx',
      'pdf': 'application/pdf',
      "doc": "doc"
    }
    console.log(MIMETypes[ext]);
    return MIMETypes[ext];
  }

  downloadFile() {

    const extension = this.candidateObj['resumeContentType'];
    const source = "data:" + extension + ";base64," + this.candidateObj["cv"];
    const downloadLink = document.createElement("a");
    const fileName = this.candidateObj.name + "." + extension;

    downloadLink.href = source;
    downloadLink.download = fileName;
    downloadLink.target = "_blank"
    downloadLink.click();

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
  //MODAL 


  isVisible = false;



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

}
