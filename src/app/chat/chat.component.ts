import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { NavbarService } from '../navbar.service';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { NavigationEnd, Router, Route, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  container: HTMLElement;
  userId = sessionStorage.getItem("userId")
  friends = [];
  mySubscription;
  chats = []
  friendProfile: any;
  constructor(private navService: NavbarService, private activatedRoute: ActivatedRoute, private service: ApplicantServiceService, private router: Router) {
  }

  ngOnInit(): void {
    this.navService.showNav();
    this.getAllFriends(this.userId)

    this.activatedRoute.params.subscribe(params => {

      let { chatroom } = params;
      if (chatroom) {
        this.service.getAllChatroomChats(chatroom)
          .subscribe((res) => {
            console.log(res)
            this.chats = res
          })
      }
      // this.initialiseState(); // reset and set based on new parameter this time
    });





  }


  setDefault() {
    $(".chatbox").slideToggle();
  }





  gotoChatroom(id, friendProfile) {
    this.friendProfile = friendProfile;
    console.log(this.friendProfile,"=======================")
    this.service.initiateChat(this.userId, id)
      .subscribe((res) => {
        console.log(res)
        this.router.navigate(["chat/" + res])
      })
  }

  getAllFriends(id) {
    this.friends = [];
    this.service.getAllFriends(id)
      .subscribe((response) => {
        console.log(response)
        // if (response) {

        response.forEach(element => {
          this.friends.push(element)
        });
        console.log(this.friends, "=====")
      })


  }




  getSelectUserChat() {

  }

  getAllChatsEverDone() {

  }

  callOnScroll() {

  }


  sendMessage() {

  }



  searchFriends() {

  }



}
