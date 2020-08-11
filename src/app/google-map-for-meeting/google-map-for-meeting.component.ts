import { NavbarService } from './../navbar.service';
import { Component, OnInit } from '@angular/core';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-google-map-for-meeting',
  templateUrl: './google-map-for-meeting.component.html',
  styleUrls: ['./google-map-for-meeting.component.css']
})
export class GoogleMapForMeetingComponent implements OnInit {
  private stompClient;
  zoom: number = 15;
  userId = sessionStorage.getItem("userId");
  meetingId;
  users = [];
  longitude = 0;
  latitude = 0;
  friendId;
  icon = '//zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png';
  constructor( private router:Router,private toastService: ToastrService,private nav: NavbarService, private activatedRoute: ActivatedRoute, private service: ApplicantServiceService) { }

  ngOnInit(): void {
    this.nav.showNav();


    this.meetingId = this.activatedRoute.snapshot.params.meetingId;
    if (this.meetingId) {
      this.getMeetingRoom();
    }

  }

  getMeetingRoom() {
    this.users = [];
    this.service.getMeetingRoom(this.meetingId, this.userId).subscribe((res) => {
      console.log(res)
      if (res.user1.location)
        this.users.push(res.user1);
      if (res.user2.location)
        this.users.push(res.user2);

        this.users.forEach(u=>{
          if(u.id!=this.userId)
          this.friendId=u.id
        })


      this.initializeWebSocketConnection();
    }
    ,(err)=>
    { 
      console.log(err)
      this.router.navigate(['invitation'])})
  }
  changePosition(longitude, latitude) {
    this.stompClient.send(`/app/location/${this.userId}/${this.meetingId}`, {}, JSON.stringify({ userId: this.userId, longitude, latitude }));
  }
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        // console.log(position)
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        // console.log(this.longitude,"  ",this.latitude)
        this.changePosition(this.longitude, this.latitude);
        this.watchLocation();

      });
    }
  }
  initializeWebSocketConnection() {
    const url = environment.baseUrl;
    let ws = new SockJS(url + "ws");
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, function (frame) {

      that.openGlobalSocket()

    });
  }
  openGlobalSocket() {
    let that = this;
    this.stompClient.subscribe(`/topic/location/${this.meetingId}`, (message) => {
      console.log(JSON.parse(message.body), "   =========message")
      let locationObj = JSON.parse(message.body);
      let index = this.users.findIndex((user) => user.id == locationObj.userId);

      console.log(index)
      if (index != -1) {

       
        let user = this.users[index];
        user.location.longitude = locationObj.longitude;
        user.location.latitude = locationObj.latitude;
        this.users.splice(index, 1, user);
        console.log("console")
      }
      console.log(this.users, "=======")


    }, { id: this.meetingId });
    this.setCurrentLocation();
  }

  watchLocation() {
    let that = this;
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(function (position) {
        console.log("Latitude is :", position.coords.latitude);
        console.log("Longitude is :", position.coords.longitude);
        that.latitude = position.coords.latitude;
        that.longitude = position.coords.longitude;
        that.changePosition(that.longitude, that.latitude);
      });
    }
  }

  onMouseOver(infoWindow, $event: MouseEvent) {
    infoWindow.open();

  }

  onMouseOut(infoWindow, $event: MouseEvent) {
    infoWindow.close();
  }

  completeMeeting() {
   
    if(this.friendId)
    this.service.completeInvitation(this.userId,this.friendId,this.meetingId)
      .subscribe((res) => {
        console.log(res)
        this.toastService.info('Successfull', 'Meeting completed')
        setTimeout(()=>{
          this.router.navigate(['invitation'])
        },1000)
      
      })
  }

  cancelMeeting() {
    if(this.friendId)
    this.service.declineInvitation(this.userId,this.friendId,this.meetingId)
      .subscribe((res) => {
        this.toastService.info('Successfull', 'Meeting cancelled')
        setTimeout(()=>{
          this.router.navigate(['invitation'])
        },1000)
      })
  }
}
