import { NavbarService } from './../navbar.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-google-map-for-meeting',
  templateUrl: './google-map-for-meeting.component.html',
  styleUrls: ['./google-map-for-meeting.component.css']
})
export class GoogleMapForMeetingComponent implements OnInit {
  zoom: number = 15;

  constructor(private nav:NavbarService) { }

  ngOnInit(): void {
    this.nav.showNav();
  }

}
