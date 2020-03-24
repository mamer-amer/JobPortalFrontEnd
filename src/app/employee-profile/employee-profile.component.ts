import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as Mapboxgl from 'mapbox-gl';
import { Job } from '../Job'
import { JobService } from '../Services/job.service'

import { ApplicantServiceService } from '../Services/applicant-service.service';
import csc from 'country-state-city'
import { MessageService } from 'primeng/api/public_api';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css']
})
export class EmployeeProfileComponent implements OnInit {


  jobObj: Job;
  selectedField;
  map: Mapboxgl.Map;
  marker: Mapboxgl.Marker;
  convertedDate: any;
  countries: Array<any> = [];
  cities: Array<any> = [];
  provinces: Array<any> = [];

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


  constructor(private jobService: JobService, public service: ApplicantServiceService,private message:NzMessageService) { }



  ngOnInit(): void {

    this.jobObj = new Job();
    this.getCountries();

    this.getPosition().then(pos => {

      Mapboxgl.accessToken = environment.mapboxKey;
      this.map = new Mapboxgl.Map({
        container: 'myMap', // container id
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [pos.lng, pos.lat], // starting position
        zoom: 12// starting zoom
      });
      this.jobObj.latitude = pos.lat;
      this.jobObj.longitude = pos.lng;

      this.marker = new Mapboxgl.Marker({
        draggable: true
      })
        .setLngLat([pos.lng, pos.lat])
        .addTo(this.map);



      this.marker.on("drag", (e) => {
        let { lng, lat } = e.target.getLngLat();
        this.jobObj.latitude = lat;
        this.jobObj.longitude = lng;

      })

    });


  }


  createMarker(long, lat) {

    const marker = new Mapboxgl.Marker({
      draggable: true,
    })
      .setLngLat([long, lat])
      .addTo(this.map);

    marker.on('drag', () => {
      console.log(marker.getLngLat())
    })


  }


  submitJob(myForm): void {
    myForm.city=myForm.city.name;
    myForm.country=myForm.country.name;
    myForm.province=myForm.province.name
    this.jobObj = myForm;


    console.log(this.jobObj)

    this.jobService.postJob(this.jobObj).subscribe((res) => {
      console.log(res)
      if(res.status==200){
        this.message.success(res.message, {
          nzDuration: 3000
        });
        // this.jobObj = null;
      }
      else{
  this.message.error(res.message, {
          nzDuration: 3000
        });
      }
     
    }, err => {
      console.log(err)

    })
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




}
