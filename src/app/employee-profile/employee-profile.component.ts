import { Component, OnInit, ViewChild, NgZone, ElementRef } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as Mapboxgl from 'mapbox-gl';
import { Job } from '../Job'
import { JobService } from '../Services/job.service'
import { ToastrService } from 'ngx-toastr';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import csc from 'country-state-city'
import { MessageService } from 'primeng/api/public_api';
import { NzMessageService } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { NavbarService } from '../navbar.service';
import { NgForm } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MapboxService } from '../Services/mapbox.service'
import { MapsAPILoader } from '@agm/core';
@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css']
})
export class EmployeeProfileComponent implements OnInit {

  @ViewChild('myform') contactForm: NgForm;
  myControl = new FormControl();
  options: string[] = [];

  @ViewChild('search')
  public searchElementRef: ElementRef;

  jobObj: Job;
  selectedField;
  address: string;
  private geoCoder;
  convertedDate: any;
  zoom: number = 15;
  cities: Array<any> = [];
  provinces: Array<any> = [];
  label: String;
  publicPost = true;
  privatePost = false;
  countries: Array<Object> = [];
  userType=sessionStorage.getItem('userType');
  userId = sessionStorage.getItem('userId');
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
  jobId: any = undefined;


  constructor(private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone, private mapboxService: MapboxService, private jobService: JobService, public service: ApplicantServiceService, private message: NzMessageService, private toastService: ToastrService, private router: Router, private navbar: NavbarService, private activatedRoute: ActivatedRoute) { }



  ngOnInit(): void {
    this.jobObj = new Job();
    this.navbar.showNav();
    this.getCountries();





    if (this.catchParams() != undefined) {
      this.label = "EDIT A JOB"
      this.getJobByParamsJobId(this.jobId);
    }
    else {
      this.label = "POST A JOB"
      this.getCurrentLocationOnPageLoad();
      this.loadMap()

    }
  }




  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.jobObj.latitude = position.coords.latitude;
        this.jobObj.longitude = position.coords.longitude;

        this.getAddress(this.jobObj.latitude, this.jobObj.longitude);
      });
    }
  }
  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {

          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }


  getCurrentLocationOnPageLoad() {
    this.getPosition().then(pos => {

      this.jobObj.longitude = pos.lng;
      this.jobObj.latitude = pos.lat;


    });
  }


  catchParams() {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.jobId = params.get('jobId');
    });
    return this.jobId;


  }



  loadMap(): Promise<any> {

    return new Promise((resolve, reject) => {



      this.mapsAPILoader.load().then(() => {
        if(!this.catchParams)
        this.setCurrentLocation();
        this.geoCoder = new google.maps.Geocoder;

        let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
        autocomplete.addListener("place_changed", () => {
          this.ngZone.run(() => {
            //get the place result
            let place: google.maps.places.PlaceResult = autocomplete.getPlace();

            //verify result
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }


            //set latitude, longitude and zoom
            this.jobObj.latitude = place.geometry.location.lat();
            this.jobObj.longitude = place.geometry.location.lng();

            console.log("helo")
          });
        });

        resolve();
      })
    })

  }



  submitJob(myForm, formTemplate): void {


    this.jobObj.city = myForm.city.name;
    this.jobObj.country = myForm.country.name;
    this.jobObj.province = myForm.province.name
    this.jobObj.title = myForm.title;
    this.jobObj.description = myForm.description;
    this.jobObj.salary = myForm.salary;
    this.jobObj.publishFrom = myForm.publishFrom;
    this.jobObj.publishTo = myForm.publishTo
    this.jobObj.category = myForm.category;
    this.jobObj.address = myForm.address;
    this.jobObj.type = myForm.type;
    
    // this.jobObj.jobPostPermission = this.publicPost==true?this.publicPost:this.privatePost;

    if (this.catchParams() != undefined) {

      this.service.updateJob(this.jobId, this.jobObj).subscribe(res => {
        if (res.status == 200) {

          this.toastService.info('Successfull', 'Job Updated Successfully');
        }
        else {
          this.toastService.error('Unsucessfull', 'Job can not be updated');

        }

      }, err => {
        this.toastService.error('Unsucessfull', 'Failed to update serve failure');

        console.log(err)
      })
    }

    else {


      if(this.publicPost==true && this.privatePost==false){
        this.jobService.postJob(this.jobObj).subscribe((res) => {
          console.log(res)
          if (res.status == 200) {
            formTemplate.reset();

            setTimeout(() => this.router.navigate(['allJobs']), 1000)
            this.toastService.info('Successfull', 'Job Posted Successfully');
          }
          else {
            this.toastService.error('Unsucessfull', 'Job can not be posted');

          }

        }, err => {
          this.toastService.error('Unsucessfull', 'Job can not be posted');

          console.log(err)

        })
      }
      else if(this.publicPost==false && this.privatePost==true){
        this.jobService.postRecruiterJob(this.jobObj).subscribe(res=>{
          if (res.status == 200) {
            formTemplate.reset();

            setTimeout(() => this.router.navigate(['allJobs']), 1000)
            this.toastService.info('Successfull', 'Job Posted Successfully');
          }
          else {
            this.toastService.error('Unsucessfull', 'Job can not be posted');

          }

        }, err => {
          this.toastService.error('Unsucessfull', 'Job can not be posted');

          console.log(err)

        })
      }
      

    }

  }



  getPosition(): Promise<any> {
    return new Promise((resolve, reject) => {

      navigator.geolocation.getCurrentPosition(resp => {

        resolve({ lng: resp.coords.longitude, lat: resp.coords.latitude });
      },
        err => {
          reject(err);
        });
    });


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

  convertDate(date: Date) {
    return (this.convertedDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate());
  }

  checkUserId() {
    const id = sessionStorage.getItem('userId');
    if (id != null) {
      return id;
    }


  }
  goBack() {
    this.router.navigate(['/'])
  }


  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  getJobByParamsJobId(id: any) {

    this.service.getJobById(id).subscribe((res) => {
      const { title, description, address, salary, longitude, latitude, publishFrom, publishTo, country, city, province, category, type,jobPostPermission } = res.result;
      this.contactForm.control.patchValue({ title, description, salary, category, type, address })
      let countryObj = this.countries.find(c => c["name"] == country);
      let stateObj = csc.getStatesOfCountry(countryObj["id"]).find(s => s.name == province);
      let cityObj = csc.getCitiesOfState(stateObj.id).find(cit => cit.name == city)
      this.provinces = csc.getStatesOfCountry(countryObj["id"]);
      this.cities = csc.getCitiesOfState(stateObj.id);
      this.jobObj.latitude = latitude;
      this.jobObj.longitude = longitude;
      this.contactForm.control.get("country").setValue(countryObj);
      this.contactForm.control.get("province").setValue(stateObj);
      this.contactForm.control.get("city").setValue(cityObj);
      this.contactForm.control.get('publishFrom').setValue(new Date(publishFrom));
      this.contactForm.control.get('publishTo').setValue(new Date(publishTo));
      if(jobPostPermission==true)this.publicPost = true;
      else{
        this.privatePost = true;
      }
      this.loadMap()

    });
  }







}
