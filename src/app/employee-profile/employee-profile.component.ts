import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as Mapboxgl from 'mapbox-gl';
import { Job } from '../Job'
import { JobService } from '../Services/job.service'

import { ApplicantServiceService } from '../Services/applicant-service.service';


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
  convertedDate:any;

  fields: any[] = [
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


  constructor(private jobService: JobService, public service: ApplicantServiceService) { }



  ngOnInit(): void {

    this.jobObj = new Job();

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
      // var popup = new Mapboxgl.Popup({ offset: 25 }).setText(
      //   'Construction on the Washington Monument began in 1848.'
      //   );
      // this.marker = new Mapboxgl.Marker({
      //  clickable:true
      // })
      //   .setLngLat([pos.lng, pos.lat])
      //   .setPopup(popup)
      //   .addTo(this.map);

      //   this.marker.getElement().addEventListener('dblclick', function (e) { console.log([pos.lng,pos.lat]); });
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
  
    this.jobObj = myForm;
    // this.jobObj.publishFrom = new Date(this.convertDate(myForm.publishFrom));
    // this.jobObj.publishTo = new Date(this.convertDate(myForm.publishFrom));


    console.log(this.jobObj)

    this.jobService.postJob(this.jobObj).subscribe((res) => {
      console.log(res)
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

  convertDate(date: Date) {
    return (this.convertedDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate());
  }

  checkUserId(){
    const id = sessionStorage.getItem('userId');
    if(id!=null){
      return id;
    }
   
  }

 

  
}
