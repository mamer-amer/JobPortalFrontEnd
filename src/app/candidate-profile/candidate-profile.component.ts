import { Component, OnInit } from '@angular/core';
import { Candidate } from './candidate';
import { Location } from '@angular/common';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { isNumber } from 'util';
import { ExportAsConfig, ExportAsService } from 'ngx-export-as';

@Component({
  selector: 'app-candidate-profile',
  templateUrl: './candidate-profile.component.html',
  styleUrls: ['./candidate-profile.component.css']
})
export class CandidateProfileComponent implements OnInit {

  userId;
  labelText = "Upload your Resume";
  allJobsbtn: any = false;
  color:any=false;
  exportAsConfig: ExportAsConfig = {
    type: 'pdf', // the type you want to download
    elementId: 'myTableElementId', // the id of html/table element
  }

  fields: any[] = [
    {value:"all",viewValue:"Show All Jobs"},
    { value: 'businessFinance', viewValue: 'Business & Finance' },
    { value: 'computersTechnology', viewValue: 'Computers & Technology' },
    { value: 'contructionTrades', viewValue: 'Contruction Trades' },
    { value: 'educationTeachingTraining', viewValue: 'Education, Teaching & Training' },
    { value: 'engineeringEngineeringTechnicians', viewValue: 'Engineering & Engineering Technicians' },
    { value: 'fishingFarmingForestry', viewValue: 'Fishing, Farming & Forestry' },
    { value: 'legalCriminalJusticeLawEnforcement', viewValue: 'Legal, Criminal Justice & Law Enforcement' },
    { value: 'management', viewValue: 'Management' },
    { value: 'mediaCommunicationsBroadcasting', viewValue: 'Media Communications & Broadcasting' },
    { value: 'militaryArmedForces', viewValue: 'Military & Armed Forces' },
    { value: 'officeAdministrationManagement', viewValue: 'Office Administration & Management' },
    { value: 'productionManufacturing', viewValue: 'Production & Manufacturing' },
    { value: 'installationRepairMaintenance', viewValue: 'Installation, Repair & Maintenance' },
    { value: 'salesMarketing', viewValue: 'Sales & Marketing' },
    { value: 'socialLifeSciences', viewValue: 'Social & Life Sciences' },
    { value: 'transportationMoving', viewValue: 'Transportation & Moving' },

  ];

  candidateObj: Candidate = new Candidate();

  constructor(private exportAsService: ExportAsService,private _location: Location, public service: ApplicantServiceService, private router: Router, private activateRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.checkUserStauts();


  }









  formValidation() {
    if (this.candidateObj.name && this.candidateObj.email && this.candidateObj.field && this.candidateObj.cv && this.candidateObj.presentationLetter && this.candidateObj.dp) {
      return false;
    }
    else {
      return true;
    }
  }


  goBack() {
    this._location.back();
  }



  _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    let base64textString = btoa(binaryString);
    //console.log(btoa(binaryString));
    this.candidateObj.cv = base64textString;
    //console.log(this.appFormObj.resume)

  }

  _handleReaderImageLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    let base64textString = btoa(binaryString);
    //console.log(btoa(binaryString));
    this.candidateObj.dp = base64textString;
    console.log(this.candidateObj.dp)

  }


  onFileChange(event) {
    console.log(event);
    let reader = new FileReader();
    try {
      if (event.target.files && event.target.files.length > 0) {
        let file = event.target.files[0];
        reader.onload = this._handleReaderLoaded.bind(this);
        this.candidateObj.resumeContentType = file.type;
        reader.readAsBinaryString(file);


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
      reader.onload = this._handleReaderImageLoaded.bind(this);
      this.candidateObj.imageContentType = file.type
      //console.log("1"+this.appFormObj.resumeContentType)
      reader.readAsBinaryString(file);
      console.log(this.candidateObj.dp)

    }
  }


  updateProfile() {

    console.log(this.candidateObj);
    this.service.postCandidateProfile(this.userId, this.candidateObj).subscribe(res => {
      this.allJobsbtn = true;
      this.labelText = "Change your resume"
      console.log(res);
    })
  }




  checkUserStauts() {
    this.userId = sessionStorage.getItem("userId");
    if (this.userId != null) {
      //get the status of user

      this.service.getCurrentProfileUserStauts(this.userId).subscribe(res => {
        console.log("Yeh hai response", res);
        if (res != null) {
          //the profile is already present
          this.candidateObj.name = res.name;
          this.candidateObj.email = res.email;
          if (res.candidateProfile != null) {
            this.labelText = "Change your resume"
            this.color = true;
            this.allJobsbtn = true;

            this.candidateObj.field = res.candidateProfile.field;
            this.candidateObj.presentationLetter = res.candidateProfile.presentationLetter;
            this.candidateObj.cv = res.candidateProfile.cv;
            this.candidateObj.dp = res.candidateProfile.dp;
       
            this.candidateObj.imageContentType = res.candidateProfile.imageContentType;
            this.candidateObj.resumeContentType = res.candidateProfile.resumeContentType;
          }


        }

        else {
          //the profile is not present

          this.candidateObj = new Candidate();
        }
      })

    }
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
    const fileName = "download." + extension;

    downloadLink.href = source;
    downloadLink.download = fileName;
    downloadLink.click();
    //const url= window.URL.createObjectURL(blob);
    //window.open(url);
  }
}
