import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavbarService } from '../navbar.service';

@Component({
  selector: 'app-cv-builder',
  templateUrl: './cv-builder.component.html',
  styleUrls: ['./cv-builder.component.css']
})
export class CvBuilderComponent implements OnInit {



  
  // isLinear = false;
  professionalSummary:any;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  socialMediaPlatforms: any[] = [
    {value: 'facebook', viewValue: 'Facebook'},
    {value: 'instagram', viewValue: 'Instagram'},
    {value: 'linkedin', viewValue: 'LinkedIn'},
    {value: 'twitter', viewValue: 'Twitter'},
    {value: "pinterest" , viewValue: 'Pinterest'}
    ];

    allDegrees:any[]=[{label:"High School Diploma",value:"High School Diploma"},
    {label:"GED",value:"GED"},
    {label:"Associate Of Arts",value:"Associate Of Arts"},
    {label:"Associate Of Science",value:"Associate Of Science"},
    {label:"Associate Of Applied Science",value:"Associate Of Applied Science"},
    {label:"Bachelor Of Arts",value:"Bachelor Of Arts"},
    {label:"Bachelor Of Science",value:"Bachelor Of Science"},
    {label:"BBA",value:"BBA"},
    {label:"Master Of Arts",value:"Master Of Arts"},
    {label:"Master Of Science",value:"Master Of Science"},
    {label:"MBA",value:"MBA"},
    {label:"J.D",value:"J.D"},
    {label:"M.D",value:"M.D"},
    {label:"PH.D",value:"PH.D"},
    {label:"Other",value:"Other"},
    
  ];
  skills:any[]=[{
    skill:""
  }]

    socialLinks: any[] = [{
      socialLink : "",
      socialSite: ""
    }];
    workHistory:any[]=[{
      jobTitle:"",companyName:"",city:"",state:"",startDate:Date,endDate:Date
    }]

    Education:any[]=[{
      schoolName:"",schoolLocation:"",degree:"",fieldOfStudy:"",GraduationStartDate:Date,GraduationEndDate:Date

    }]
  constructor(private navbar: NavbarService,private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.navbar.showNav();
   
  }
  name:any;
  email:any;

  display(){
    console.log(this.socialLinks)
  }
  addSocialLink(){
    this.socialLinks.push({
     socialLink : "",
     socialSite: ""
    })
   
   }
   addWorkHistory(){
     this.workHistory.push({
      jobTitle:"",companyName:"",city:"",state:"",startDate:Date,endDate:Date
    })
   }
   removeWorkHistory(id:any){
     this.workHistory.splice(id,1)
   }
 
   removeSocialLink(i: number) {
     this.socialLinks.splice(i, 1);
   }
   addEducation(){
     this.Education.push({
      schoolName:"",schoolLocation:"",degree:"",fieldOfStudy:"",GraduationStartDate:Date,GraduationEndDate:Date

    })
   }
   removeEducation(id:any){
     this.Education.splice(id,1);

   }
   addSkill(){
     this.skills.push({
      skill:""
    })

   }
   removeSkill(id:any){
     this.skills.splice(id,1);

   }
  

}
