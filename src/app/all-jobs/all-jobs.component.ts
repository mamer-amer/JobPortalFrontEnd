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
  selectedCategory: any;
  allJobs: Array<any> = []
  empty = false;
  cityName: any;
  userType: any;




  constructor(private _location: Location, public service: ApplicantServiceService, private router: Router, private activateRoute: ActivatedRoute) {



  }
  page = 1;
  public total: any;
  itemsPerPage: any;


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
  // -1 from page because we are getting default 0 page number data from db so page 2 in frontEnd is 1 in backend

  ngOnInit(): void {
    this.userType = sessionStorage.getItem('userType');

    if (this.userType == "candidate") {
      this.getPaginatedJobs(0);
    }
    else {
      this.getJobsByCompany(0);
    }

    this.loadMap();
    this.showMarkersOnMap();



  }

  pageChange(p): void {

    console.log(p);
    if (this.selectedCategory != null) {
      this.getJobsByCategory(this.selectedCategory, p - 1);
    }
    else if (this.userType == "candidate") {
      this.getPaginatedJobs(p - 1);

    }
    else if (this.cityName == null) {
      this.getJobsByCompany(p - 1);
    }
    else if (this.cityName != null) {
      this.searchByCityName(this.cityName, p - 1);
    }

  }






  getPaginatedJobs(p): void {
    this.service.getPaginatedJobs(p).subscribe((response) => {

      if (response.totalElements > 0) {
        console.log(response)
        this.total = response.totalElements;
        this.page = p + 1;
        this.itemsPerPage = response.size;
        this.allJobs = response.content
        this.empty = false;
      }
      else {
        this.empty = true;
      }
    })
  }

  getJobsByCategory(cat, p): void {

    console.log(cat)
    this.allJobs = []
    this.selectedCategory = cat;
    this.total = 0;
    this.itemsPerPage = 0;
    this.page = 0;
    this.service.getPaginatedJobsByCategory(cat, p).subscribe((res) => {

      if (res.totalElements > 0) {
        this.allJobs = res.content;
        this.total = res.totalElements;
        this.page = p + 1;
        this.itemsPerPage = res.size;
        this.empty = false;

      }
      else {
        this.empty = true;
      }
      console.log(this.empty)

    })
  }

  showMarkersOnMap(): void {
    this.service.getAllJobs().subscribe(res => {
      console.log("All jobs here", res)

      res.forEach(element => this.createMarker(element.longitude, element.latitude, element.title, element.id));
    })


  }


  routeToJobDetailsComponent(id): void {
    this.router.navigate(['/job/' + id])
  }




  createMarker(long, lat, title, id) {


    // var popup = new Mapboxgl.Popup({ offset: 40 })
    // .setHTML('<div><p class="capatalize" style="margin:5px;color:#464646;font-style:italic;font-weight:bold">' + title + '</p><a>'+id+'</a><div>');
    var marker = new Mapboxgl.Marker({})
      .setLngLat([long, lat])
      .addTo(this.map);


    // marker.getElement().addEventListener('dblclick', () => {
    //   console.log(marker.getLngLat())

    // })
    marker.getElement().addEventListener('click', () => {
      console.log(marker.getLngLat())

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
        zoom: 6// starting zoom
      });
    })
  }

  test() {
    console.log("hello")
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

  getJobsByCompany(p) {
    this.allJobs = []
    this.total = 0;
    this.itemsPerPage = 0;
    this.page = 0;
    this.service.getJobsByCompany(p).subscribe(response => {
      console.log("this is what you want", response)
      if (response.totalElements > 0) {
        console.log(response)
        this.total = response.totalElements;
        this.page = p + 1;
        this.itemsPerPage = response.size;
        this.allJobs = response.content
        this.empty = false;
      }
      else {
        this.empty = true;
      }
    })
  }

  searchByCityName(city, page) {
    this.allJobs = []
    this.total = 0;
    this.itemsPerPage = 0;
    this.page = 0;
    this.service.getAllJobsByCityName(city, page).pipe().subscribe(res => {
      if (res.totalElements > 0) {
        this.allJobs = res.content;
        this.total = res.totalElements;
        this.page = page + 1;
        this.itemsPerPage = res.size;
        this.empty = false;

      }
      else {
        this.empty = true;
      }
    })
  }
}




