import { Component, OnInit, ViewChild, Input, EventEmitter } from '@angular/core';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as Mapboxgl from 'mapbox-gl';
import { environment } from '../../environments/environment'



@Component({
  selector: 'app-all-jobs',
  templateUrl: './all-jobs.component.html',
  styleUrls: ['./all-jobs.component.css']
})
export class AllJobsComponent implements OnInit {

  /** Constants used to fill up our data base. */

  // pageChange=new EventEmitter();

  allJobs: Array<any> = []


  constructor(private _location: Location, private service: ApplicantServiceService, private router: Router, private activateRoute: ActivatedRoute) {



  }
  page: number = 1;
  total: number;
  itemsPerPage: number;


  logout() {
    sessionStorage.clear();
    this.router.navigateByUrl('');
  }

  goBack() {
    this._location.back();
  }



  map: Mapboxgl.Map;
  marker: Mapboxgl.Marker;
  tooltips = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
  value = 3;


  ngOnInit(): void {
    this.getPaginatedJobs(0);
    this.loadMap();
    this.showMarkersOnMap();



  }

  pageChange(p): void {

    this.getPaginatedJobs(p - 1);
  }





  getPaginatedJobs(p): void {
    this.service.getPaginatedJobs(p).subscribe((response) => {
      console.log(response)
      this.total = response.totalPages;
      this.page = p + 1;
      this.itemsPerPage = response.size;
      this.allJobs = response.content
    })
  }

  getJobsByCategory(cat): void {
    console.log(cat)
   this.service.getPaginatedJobsByCategory(cat,0).subscribe((res)=>{
     console.log(res)
   })
  }

  showMarkersOnMap(): void {
    this.service.getAllJobs().subscribe(res => {

      res.forEach(element => this.createMarker(element.longitude, element.latitude, element.title));
    })


  }


  createMarker(long, lat, title) {

    var popup = new Mapboxgl.Popup({ offset: 20 })
      .setHTML('<div ><p class="capatalize" style="margin:5px;color:#464646;font-style:italic">' + title + '</p><div>')
    var marker = new Mapboxgl.Marker({})
      .setLngLat([long, lat])
      .setPopup(popup)
      .addTo(this.map);


    marker.getElement().addEventListener('dblclick', () => {
      // console.log(marker.getLngLat())
    })


  }



  loadMap() {
    this.getCurrentPosition().then(pos => {
      console.log(pos)
      Mapboxgl.accessToken = environment.mapboxKey;
      this.map = new Mapboxgl.Map({
        container: 'myMap', // container id
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [pos.lng, pos.lat], // starting position
        zoom: 8// starting zoom
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




