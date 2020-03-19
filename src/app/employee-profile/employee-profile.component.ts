import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as Mapboxgl from 'mapbox-gl';
@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css']
})
export class EmployeeProfileComponent implements OnInit {



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

  latitude = 38.8951;
  longitude = -77.0364;

  selectedField;
  constructor() { }

  map: Mapboxgl.Map;

  ngOnInit(): void {

    this.getPosition().then(pos => {
     
      Mapboxgl.accessToken = environment.mapboxKey;
      this.map = new Mapboxgl.Map({
        container: 'myMap', // container id
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [pos.lng, pos.lat], // starting position
        zoom: 12// starting zoom
      });
      const marker = new Mapboxgl.Marker({
        draggable: true,
        })
        .setLngLat([pos.lng, pos.lat])
        .addTo(this.map);
  
        marker.on('drag',()=>{
          console.log(marker.getLngLat())
        })
    });

    

  }


  createMarker(long,lat){
    
    const marker = new Mapboxgl.Marker({
      draggable: true,
      })
      .setLngLat([long, lat])
      .addTo(this.map);

      marker.on('drag',()=>{
        console.log(marker.getLngLat())
      })

      
  }


  submitJob(myForm): void {
    console.log(myForm)
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
}
