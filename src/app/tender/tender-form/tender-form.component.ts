import { Component, OnInit } from '@angular/core';
import { Tender } from './tender';
import csc from 'country-state-city'
import { ActivatedRoute,Router } from '@angular/router';
import { TenderService } from '../../Services/tender.service';
import { ToastrService } from 'ngx-toastr';
import { NavbarService } from '../../navbar.service';

@Component({
  selector: 'app-tender-form',
  templateUrl: './tender-form.component.html',
  styleUrls: ['./tender-form.component.css']
})
export class TenderFormComponent implements OnInit {
 
  recruiterId: any;
  interviewStartDate:Date;
  interviewEndDate:Date;
  interviewStartTiming:Date;
  interviewEndTiming:Date;
  tenderobj:Tender=new Tender();
  countries: Array<Object> = [];
  cities: Array<any> = [];
  provinces: Array<any> = [];
  label:string="Add Tender";
  userType = sessionStorage.getItem('userType');
  userId = sessionStorage.getItem('userId');
  constructor(private navbar: NavbarService,private activatedRoute: ActivatedRoute,private tenderservice:TenderService,private toastService: ToastrService,private router: Router ) { }
  salaryRange: Array<string> = [
    "10,000$ - 20,000$",
    "20,000$ - 30,000$",
    "30,000$ - 40,000$",
    "50,000$ - above",
    "Confidential"
  ];
  jobTypes: Array<string> = ["Freelance", "Full-time", "Part-time", "Internship", "Temporary"];

  fields: any[] = [
    { value: 'Business & Finance', viewValue: 'Business & Finance' },
    { value: 'Computers & Technology', viewValue: 'Computers & Technology' },
    { value: 'Contruction Trades', viewValue: 'Contruction Trades' },
    { value: 'Education, Teaching & Training', viewValue: 'Education, Teaching & Training' },
    { value: 'Engineering & Engineering Technicians', viewValue: 'Engineering & Engineering Technicians' },
    { value: 'Fishing, Farming & Forestry', viewValue: 'Fishing, Farming & Forestry' },
    { value: 'Legal, Criminal Justice & Law Enforcement', viewValue: 'Legal, Criminal Justice & Law Enforcement' },
    { value: 'Management', viewValue: 'Management' },
    { value: 'Media Communications & Broadcasting', viewValue: 'Media Communications & Broadcasting' },
    { value: 'Military & Armed Forces', viewValue: 'Military & Armed Forces' },
    { value: 'Office Administration & Management', viewValue: 'Office Administration & Management' },
    { value: 'Production & Manufacturing', viewValue: 'Production & Manufacturing' },
    { value: 'Installation, Repair & Maintenance', viewValue: 'Installation, Repair & Maintenance' },
    { value: 'Sales & Marketing', viewValue: 'Sales & Marketing' },
    { value: 'Social & Life Sciences', viewValue: 'Social & Life Sciences' },
    { value: 'Transportation & Moving', viewValue: 'Transportation & Moving' },

  ];
  ngOnInit(): void {
    this.recruiterId = this.activatedRoute.snapshot.params['id'];
    if(this.recruiterId==null){this.label = "Add Public Tender"}
    this.navbar.showNav();
    this.getCountries();

  }
  changedatetostring(date:Date){

    let converteddate=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getUTCDate();
    return converteddate;



  }
   formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }
  
  getCountries(): void {

    this.countries = [
      {
        id: "38",
        name: "Canada",
        phonecode: "1",
        sortname: "CA"
      },
      {
        id: "231",
        name: "United States",
        phonecode: "1",
        sortname: "US",
      }
    ]

  }
  countryChange(countryObj): void {
    if (countryObj.value) {

      this.provinces = csc.getStatesOfCountry(countryObj.value.id)
      this.cities = null
    }
    else {
      this.provinces = null;
      this.cities = null
    }
  }
  provinceChange(provinceObj): void {
    if (provinceObj.value) {
      this.cities = csc.getCitiesOfState(provinceObj.value.id);
    }
    else {
      this.cities = null;
    }
  }
  submittender(myform){

    if(this.recruiterId == null){
      this.tenderobj.tenderType="public";
      this.recruiterId = null;
      console.log("rrrrrr",this.recruiterId);
    }
    else{
      this.tenderobj.tenderType="private";
    }
    this.tenderobj.employerUserId=this.userId;
    this.tenderobj.interviewStartDate=this.changedatetostring(this.interviewStartDate);
    this.tenderobj.interviewEndDate=this.changedatetostring(this.interviewEndDate);
    this.tenderobj.interviewStartTiming=this.formatAMPM(this.interviewStartTiming);
    this.tenderobj.interviewEndTiming=this.formatAMPM(this.interviewEndTiming);
    this.tenderobj.city=myform.city.name;
    this.tenderobj.province=myform.province.name;
    this.tenderobj.country=myform.country.name;
    this.tenderobj.recruiterUserId=this.recruiterId;
    // this.tenderobj.tenderType = myform.tenderType;
    
    console.log("tenderrrrrrrrrrrr",this.tenderobj);
    this.tenderservice.postTender(this.tenderobj).subscribe(res=>{
      console.log(res);
      this.toastService.info('Successfull', 'Tender Posted Successfully');

      this.router.navigate(['/publictender']);

    },error=>{
      this.toastService.error('Unsucessfull', 'Tender can not be posted');
    })


  }

}
