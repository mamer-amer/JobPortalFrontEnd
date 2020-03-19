import { Component, OnInit } from '@angular/core';
import * as Mapboxgl from 'mapbox-gl';
import { environment } from '../../environments/environment'
@Component({
  selector: 'app-employee-alljobs',
  templateUrl: './employee-alljobs.component.html',
  styleUrls: ['./employee-alljobs.component.css']
})
export class EmployeeAlljobsComponent implements OnInit {

  map: Mapboxgl.Map;
  marker: Mapboxgl.Marker;

  constructor() { }

  ngOnInit(): void {
    this.loadMap();
  }

  loadMap() {
    this.getCurrentPosition().then(pos => {
      Mapboxgl.accessToken = environment.mapboxKey;
      this.map = new Mapboxgl.Map({
        container: 'myMap', // container id
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [pos.lng, pos.lat], // starting position
        zoom: 12// starting zoom
      });
    })
  }

  getCurrentPosition(): Promise<any> {
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
