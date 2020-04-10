import { Component, OnInit, ViewChild } from '@angular/core';
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
@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css']
})
export class EmployeeProfileComponent implements OnInit {

  @ViewChild('myform') contactForm: NgForm;
  myControl = new FormControl();
  options: string[] = [];
  filteredPlaces: Array<string> = [];
  selectedPlace;
  check = "hello"
  jobObj: Job;
  selectedField;
  map: Mapboxgl.Map;
  marker: Mapboxgl.Marker;
  convertedDate: any;
  countries: Array<any> = [];
  cities: Array<any> = [];
  provinces: Array<any> = [];

  jobTypes:Array<string> = ["Full-time", "Part-time", "Contract", "Internship", "New-Grad"];

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
  jobId: any;


  constructor(private mapboxService: MapboxService, private jobService: JobService, public service: ApplicantServiceService, private message: NzMessageService, private toastService: ToastrService, private router: Router, private navbar: NavbarService, private activatedRoute: ActivatedRoute) { }



  ngOnInit(): void {

    this.myControl.valueChanges.subscribe((value) => {

      this.filteredPlaces = []
      if (value)
        this.mapboxService.getGeoLocations(value).subscribe((res) => {
          res.features.map((places) => {
            this.filteredPlaces.push(places)

          })
        })
    })


    this.jobObj = new Job();
    this.navbar.showNav();

    if (this.catchParams() != undefined) {
      this.getJobByParamsJobId(this.jobId);
    }



    else {
      this.getCountries();
      this.getCurrentLocationOnPageLoad();

    }
  }


  onPlaceSelect(v) {
    this.selectedPlace = v;
    this.map.flyTo({
      center: [
        v.center[0],
        v.center[1]
      ],
      essential: true // this animation is considered essential with respect to prefers-reduced-motion
    });

    this.marker.setLngLat([v.center[0], v.center[1]])
    this.jobObj.longitude = v.center[0];
    this.jobObj.latitude = v.center[1];


  }


  getCurrentLocationOnPageLoad() {
    this.getPosition().then(pos => {

      this.createMap(pos.lng, pos.lat)

      this.createMarker(pos.lng, pos.lat)

    });
  }


  catchParams() {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.jobId = params.get('jobId');
    });
    return this.jobId;


  }

  createMarker(long, lat) {

    this.jobObj.latitude = lat;
    this.jobObj.longitude = long;

    this.marker = new Mapboxgl.Marker({
      draggable: true
    })
      .setLngLat([long, lat])
      .addTo(this.map);

    this.marker.on("drag", (e) => {
      let { lng, lat } = e.target.getLngLat();
      this.jobObj.latitude = lat;
      this.jobObj.longitude = lng;

    })

  }





  submitJob(myForm,formTemplate): void {


    this.jobObj.city = myForm.city.name;
    this.jobObj.country = myForm.country.name;
    this.jobObj.province = myForm.province.name
    this.jobObj.title = myForm.title;
    this.jobObj.description = myForm.description;
    this.jobObj.salary = myForm.salary;
    this.jobObj.publishFrom = myForm.publishFrom;
    this.jobObj.publishTo = myForm.publishTo
    this.jobObj.category = myForm.category;
    this.jobObj.type = myForm.title;

  

    this.jobService.postJob(this.jobObj).subscribe((res) => {
    
      if (res.status == 200) {

        this.toastService.info('Successfull', 'Job Posted Successfully');
        formTemplate.reset();
        this.selectedPlace=[];
        this.filteredPlaces=[];
        setTimeout(()=>this.router.navigate(['allJobs']),1000)
        
      }
      else {
        this.toastService.error('Unsucessfull', 'Job can not be posted');

      }

    }, err => {
      this.toastService.error('Unsucessfull', 'Job can not be posted');

    })
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(place => place.toLowerCase().indexOf(filterValue) === 0);
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

    this.countries = csc.getAllCountries();
  }
  countryChange(countryObj): void {
    if (countryObj.value) {
      this.provinces = csc.getStatesOfCountry(countryObj.value.id)
    }
    else {
      this.provinces = null;
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
      const { title, description, salary, longitude, latitude, publishFrom, publishTo, country, city, province, category, type } = res.result;
      this.contactForm.setValue({ title, description, salary, publishFrom, publishTo, country, city, province, category, type });
      this.createMap(longitude, latitude);
      this.createMarker(longitude, latitude);
    });
  }


  createMap(lng, lat) {

    Mapboxgl.accessToken = environment.mapboxKey;
    this.map = new Mapboxgl.Map({
      container: 'myMap', // container id
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat], // starting position
      zoom: 12// starting zoom
    });
  }




}
