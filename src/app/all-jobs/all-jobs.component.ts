import { Component, OnInit, ViewChild, Input, EventEmitter, ElementRef, NgZone } from '@angular/core';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import * as Mapboxgl from 'mapbox-gl';
import { environment } from '../../environments/environment'
import * as moment from 'moment';
import { NavbarService } from '../navbar.service';
import { Http2ServerRequest } from 'http2';
import { request } from 'http';
import { HttpClient } from 'selenium-webdriver/http';
import { ToastrService } from 'ngx-toastr';
import { FormControl, NgForm } from '@angular/forms';
import { MapboxService } from '../Services/mapbox.service';
import { NzModalService } from 'ng-zorro-antd';
// import { NavbarService } from 'angular-bootstrap-md';
import { MapsAPILoader, MouseEvent } from '@agm/core';


@Component({
  selector: 'app-all-jobs',
  templateUrl: './all-jobs.component.html',
  styleUrls: ['./all-jobs.component.css']
})

export class AllJobsComponent implements OnInit {

  @ViewChild('myFrom') myFrom: NgForm
  /** Constants used to fill up our data base. */
  selectedJobType = "all";
  // pageChange=new EventEmitter();
  selectedCategory: any;
  allJobs: Array<any> = []
  companyName = "";
  empty = false;
  cityName: any = "";
  userType: any;
  date: string;

  isAllJobs = true;
  selectedPlace: any;
  myControl = new FormControl();

  options: string[] = [];
  filteredPlaces: Array<string> = [];
  longitude: number;
  latitude: number;
  zoom: number = 15;
  address: string;
  private geoCoder;
  companyId = sessionStorage.getItem("companyId");
  tabs = [1, 2];

  @ViewChild('search')
  public searchElementRef: ElementRef;
  
  privateJobs = false;


  constructor(private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone, private mapboxService: MapboxService, private _location: Location, public service: ApplicantServiceService, private router: Router, private activateRoute: ActivatedRoute, public navService: NavbarService, private toastService: ToastrService, private modalService: NzModalService) {


    // this.date = moment((new Date()), "YYYYMMDD").fromNow();

  }
  page = 1;
  public total: any;
  itemsPerPage: any;


  logout() {
    sessionStorage.clear();
    this.router.navigateByUrl('');
  }

  showDeleteConfirm(jobId: any, index: any, page: any): void {
    this.modalService.confirm({
      nzTitle: 'Are you sure you want to delete?',
      nzContent: '<b style="color: red;">Press Ok to delete and cancel to reject</b>',
      nzOkText: 'Yes',
      nzOkType: 'danger',
      nzOnOk: () => {
        this.deleteJob(jobId, index, page)
      },
      nzCancelText: 'No',
      nzOnCancel: () => {
        // window.history.go(-1);
      }
    });
  }






  goBack() {
    this._location.back();
  }





  tooltips = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
  value = 3;
  // -1 from page because we are getting default 0 page number data from db so page 2 in frontEnd is 1 in backend

  ngOnInit(): void {
    this.navService.showNav();
    this.userType = sessionStorage.getItem('userType');



    if (this.userType == "candidate") {
      this.globalSearch(this.cityName, this.selectedJobType, this.companyName, 0);
    }
    else {
      this.getJobsByCompany(0);
    }

    this.loadMap()
    // .then(() => this.showMarkersOnMap())




  }





  pageChange(p): void {


    if (this.selectedCategory != null && this.userType == "candidate") {
      this.getJobsByCategory(this.selectedCategory, p - 1);
    }

    else if (this.userType == "candidate" && this.selectedCategory == null && (this.cityName != null || this.selectedJobType != null || this.companyName != null)) {
      this.globalSearch(this.cityName, this.selectedJobType, this.companyName, p - 1);
    }



    else if (this.userType != "candidate" && this.selectedCategory == null) {
      this.getJobsByCompany(p - 1);
    }

    else if (this.userType != "candidate" && this.selectedCategory == null && this.privateJobs==true) {
      this.getJobsByCompany(p - 1);
    }
    else if (this.userType != "candidate" && this.selectedCategory != null && this.privateJobs==false) {
      this.getJobsByCategory(this.selectedCategory, p - 1);
    }
    else if (this.userType != "candidate" && this.selectedCategory != null && this.privateJobs==true) {
      this.getJobsByCategory(this.selectedCategory, p - 1);
    }

  }






  getPaginatedJobs(p): void {
    this.allJobs = []
    this.total = 0;
    this.itemsPerPage = 0;
    this.page = 0;
    this.selectedCategory = null;

    if (this.userType == "candidate") {
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
          this.page = response.pageable.pageNumber + 1;
          this.total = response.totalElements;
          this.empty = true;
        }
      }), error => {
        setTimeout(() => {
          this.empty = true;
        }, 2000)
      }
    }
    else {
      this.getJobsByCompany(0);
    }

  }

  getJobsByCategory(cat, p): void {


    this.allJobs = []
    this.selectedCategory = cat;
    this.total = 0;
    this.itemsPerPage = 0;
    this.page = 0;
    if(this.privateJobs==true){
      this.service.getPaginatedJobsByCategoryPrivate(cat, p).subscribe((res) => {

        if (res.totalElements > 0) {
          this.allJobs = res.content;
          this.total = res.totalElements;
          this.page = res.pageable.pageNumber + 1;
          this.itemsPerPage = res.size;
          this.empty = false;

        }
        else {
          this.page = res.pageable.pageNumber + 1;
          this.total = res.totalElements;

          setTimeout(() => {
            this.empty = true;
          }, 2000)

        }
        console.log(this.empty)

      }), error => {
        setTimeout(() => {
          this.empty = true;
        }, 2000)
      }
    }
    else{
      this.service.getPaginatedJobsByCategory(cat, p).subscribe((res) => {

        if (res.totalElements > 0) {
          this.allJobs = res.content;
          this.total = res.totalElements;
          this.page = res.pageable.pageNumber + 1;
          this.itemsPerPage = res.size;
          this.empty = false;

        }
        else {
          this.page = res.pageable.pageNumber + 1;
          this.total = res.totalElements;

          setTimeout(() => {
            this.empty = true;
          }, 2000)

        }
        console.log(this.empty)

      }), error => {
        setTimeout(() => {
          this.empty = true;
        }, 2000)
      }
    }
   
  }

  showMarkersOnMap(): void {
    this.service.getAllJobs().subscribe(res => {

      // res.forEach(element => this.createMarker(element.longitude, element.latitude, element.title, element.id));
    })


  }


  routeToJobDetailsComponent = (id) =>{
    this.privateJobs == false ? this.router.navigate(['/job/' + id]) : this.router.navigate(['/privatejob/'+id]);
  } 
    

  routeToCompanyProfile = (id) => this.router.navigate(['companyProfileDetails/' + id]);












  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
       
        this.getAddress(this.latitude, this.longitude);
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
          console.log('No results found');
        }
      } else {
       console.log('Geocoder failed due to: ' + status);
      }

    });
  }
  loadMap(): Promise<any> {

    return new Promise((resolve, reject) => {



      this.mapsAPILoader.load().then(() => {
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

            console.log("places")
            //set latitude, longitude and zoom
            this.latitude = place.geometry.location.lat();
            this.longitude = place.geometry.location.lng();
            
            console.log("helo")
          });
        });

        resolve();
      })
    })

  }


  onMouseOver(infoWindow, $event: MouseEvent) {
    infoWindow.open();
}

onMouseOut(infoWindow, $event: MouseEvent) {
    infoWindow.close();
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
    // check for public or private jobs

    if(this.privateJobs==true){
        // show private jobs else 
      this.service.getJobsByCompanyPrivate(p,this.companyId).subscribe(response => {

        console.log(response, "======jobs by company")
        if (response.totalElements > 0) {

          this.total = response.totalElements;
          this.page = p + 1;
          this.itemsPerPage = response.size;
          this.allJobs = response.content
          this.empty = false;
        }
        else {
          this.page = response.pageable.pageNumber + 1;
          this.total = response.totalElements;
          this.empty = true;
        }
      });
    }
    else{
      this.service.getJobsByCompany(p).subscribe(response => {

        console.log(response, "======jobs by company")
        if (response.totalElements > 0) {

          this.total = response.totalElements;
          this.page = p + 1;
          this.itemsPerPage = response.size;
          this.allJobs = response.content
          this.empty = false;
        }
        else {
          this.page = response.pageable.pageNumber + 1;
          this.total = response.totalElements;
          this.empty = true;
        }
      });
    }
   
  }


  globalSearch(city, type, company, pageNo) {
    this.allJobs = []
    this.total = 0;
    this.itemsPerPage = 0;
    this.page = 0;
    this.selectedCategory = null;

    this.service.globalJobSearch(city, type, company, pageNo).subscribe(response => {
      console.log("global search jobs", response)
      if (response.totalElements > 0) {
        console.log(response)
        this.total = response.totalElements;
        this.page = response.pageable.pageNumber + 1;
        this.itemsPerPage = response.size;
        this.allJobs = response.content
        this.empty = false;
      }
      else {
        this.page = response.pageable.pageNumber + 1;
        this.total = response.totalElements;
        this.empty = true;
      }
    }), error => {
      setTimeout(() => {
        this.empty = true;
      }, 2000)
    }
  }

  searchByCityName(city, page) {
    this.allJobs = []
    this.total = 0;
    this.itemsPerPage = 0;
    this.page = 0;
    this.service.getAllJobsByCityName(city, page).pipe().subscribe(res => {
      console.log(res, "=======city")
      if (res.totalElements > 0) {

        this.allJobs = res.content;
        this.total = res.totalElements;
        this.page = page + 1;
        this.itemsPerPage = res.size;
        this.empty = false;

      }
      else {
        this.total = res.totalElements;
        this.empty = true;
      }
    })
  }



  deleteJob(id: any, index: any, page: any) {

    console.log("This job is going to be delete", this.allJobs[index]);
    this.service.deleteJob(id, page - 1,this.privateJobs).subscribe(res => {
      if (res.status == 200) {
        this.toastService.info('Deleted')
        //  this.allJobs.slice(index,1);
        this.loadMap()
          .then(() => this.showMarkersOnMap())
        if (res.result.totalElements > 0) {
          this.allJobs = res.result.content;
          this.total = res.result.totalElements;
          this.page = res.result ? res.result.pageable.pageNumber + 1 : 1;
          this.itemsPerPage = res.result.size;
          this.empty = false;

        }
        else {
          this.page = res.pageable.pageNumber + 1;
          this.total = res.result.totalElements;
          this.empty = true;
        }
      }

      else {
        this.toastService.error('Failed')

      }
    }), error => {
      this.toastService.error('Failed')
    }
  }


  clearForm() {
    console.log(this.myFrom.valid);
    this.myFrom.reset();
    this.selectedCategory = "";
    this.selectedJobType = "all"
    this.globalSearch(this.cityName, this.selectedJobType, this.companyName, 0);
  }




}




