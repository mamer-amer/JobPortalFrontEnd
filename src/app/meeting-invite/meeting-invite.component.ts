import { Component, OnInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { NavbarService } from '../navbar.service';
import { MapsAPILoader } from '@agm/core';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-meeting-invite',
  templateUrl: './meeting-invite.component.html',
  styleUrls: ['./meeting-invite.component.css']
})
export class MeetingInviteComponent implements OnInit {
  selectedPlace: any;
  // myControl = new FormControl();

  options: string[] = [];
  filteredPlaces: Array<string> = [];
  longitude: number;
  latitude: number;
  zoom: number = 15;
  address: string;
  countries:Array<string>=[];

  private geoCoder;
  comment: String = "";
  id = sessionStorage.getItem("userId")
  friendId;

  @ViewChild('search')
  public searchElementRef: ElementRef;
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private toastService: ToastrService, private service: ApplicantServiceService, private ngZone: NgZone, private mapsAPILoader: MapsAPILoader, private nav: NavbarService) {
    this.countries=["US","Canada"];
    console.log(this.countries,"=======")
    this.friendId = this.activatedRoute.snapshot.params.id;
    this.nav.showNav();
    if (this.friendId) {

      this.loadMap()
    }
  }

  ngOnInit(): void {
  }


  //inviation modal work

  sendInvite(formObj) {


    console.log(formObj,"=======")
    // let obj = {
    //   userId: this.id,
    //   friendId: this.friendId,
    //   longitude: this.longitude,
    //   latitude: this.latitude,
    //   comment: this.comment
    // }

    formObj.userId=this.id
    formObj.friendId=this.friendId;
    formObj.longitude=this.longitude;
    formObj.latitude=this.latitude;
    this.service.sendMeetingInvite(formObj)
      .subscribe((res) => {
        if (res) {

          this.toastService.info('Invitation sent successfully')
          setTimeout(() => {
            this.router.navigate(['invitation']);
          }, 2000)
        }
        else {
          this.toastService.error('failed to send invitation')
        }
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

      // this.invitationIsVisible=true;

      this.mapsAPILoader.load().then(() => {
        this.setCurrentLocation();
        this.geoCoder = new google.maps.Geocoder;

        let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
        // this.invitationIsVisible=false;
        autocomplete.addListener("place_changed", () => {
          this.ngZone.run(() => {
            //get the place result
            console.log("yes")
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
}
