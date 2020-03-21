import { Component, OnInit, ViewChild } from '@angular/core';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as Mapboxgl from 'mapbox-gl';
import { environment } from '../../environments/environment'
import csc from 'country-state-city'

@Component({
  selector: 'app-all-jobs',
  templateUrl: './all-jobs.component.html',
  styleUrls: ['./all-jobs.component.css']
})
export class AllJobsComponent implements OnInit {

  /** Constants used to fill up our data base. */





  constructor(private _location: Location, private service: ApplicantServiceService, private router: Router, private activateRoute: ActivatedRoute) {

  

  }







  logout() {
    sessionStorage.clear();
    this.router.navigateByUrl('');
  }

  goBack() {
    this._location.back();
  }


  // showAllJobs() {
  //   this.service.getAllJobs().subscribe(res => {
  //     console.log(res);

  //     res.map(d=>{
  //       this.tableData.push({
  //         title: d.title,
  //         field: d.field,
  //         description: d.description,
  //         salary: d.salary,
  //         datePosted: d.datePosted
  //       })
  //     })

  //     console.log(this.tableData)
  //     this.dataSource = new MatTableDataSource(this.tableData);
  //     this.dataSource.paginator = this.paginator;
  //   })
  // }


  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();

  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }

  // searchWithField(){
  //   if (this.selectedfield!=null){
  //     this.service.searchJobWithRespectToField(this.selectedfield).subscribe(res=>{

  //         if(res){
  //           this.message = false;
  //           this.tableData = [];
  //           this.dataSource = null;
  //           res.map(d => {
  //             this.tableData.push({
  //               title: d.title,
  //               field: d.field,
  //               description: d.description,
  //               salary: d.salary,
  //               datePosted: d.datePosted
  //             })
  //           });
  //           this.dataSource = new MatTableDataSource(this.tableData);
  //           this.dataSource.paginator = this.paginator;

  //         }
  //         else{

  //             this.message = true;

  //         }


  //       })
  //   }
  // }



  map: Mapboxgl.Map;
  marker: Mapboxgl.Marker;
  tooltips = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
  value = 3;


  ngOnInit(): void {
    this.loadMap();
    this.showMarkersOnMap();
  }


  showMarkersOnMap(): void {
    this.service.getAllJobs().subscribe(res => {
      console.log(res)

      res.forEach(element => this.createMarker(element.longitude, element.latitude,element.title));
    })

  }


  createMarker(long, lat,title) {

   var popup = new Mapboxgl.Popup({ offset: 20 })
   .setHTML('<div ><p class="capatalize" style="margin:5px;color:#464646;font-style:italic">' + title + '</p><div>')
    var marker = new Mapboxgl.Marker({})
      .setLngLat([long, lat])
      .setPopup(popup)
      .addTo(this.map);
    

    marker.getElement().addEventListener('dblclick', () => {
      console.log(marker.getLngLat())
    })


  }

  loadMap() {
    this.getCurrentPosition().then(pos => {
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




