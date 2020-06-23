import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as $ from 'jquery';
import { NavbarService } from '../navbar.service';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { NavigationEnd, Router, Route, ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment'
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ChatComponent implements OnInit {

  private stompClient;
  container: HTMLElement;
  userId = sessionStorage.getItem("userId")
  friends = [];
  mySubscription;
  chats = []
  friendProfile: any;
  chatroomId=2;
  constructor(private navService: NavbarService, private activatedRoute: ActivatedRoute, private service: ApplicantServiceService, private router: Router) {
    this.initializeWebSocketConnection();
  }

  ngOnInit(): void {
    this.navService.showNav();
    this.getAllFriends(this.userId)

    this.activatedRoute.params.subscribe(params => {

      let { chatroom } = params;
      if (chatroom) {
        this.chatroomId = chatroom;
        // this.openGlobalSocket();
        this.service.getAllChatroomChats(chatroom)
          .subscribe((res) => {
            console.log(res)
            
            this.chats = res
          })
      }
      // this.initialiseState(); // reset and set based on new parameter this time
    });

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
    this.stompClient.subscribe(`/topic/chatroom/${this.chatroomId}`, (message) => {
      console.log(JSON.parse(message.body), "   =========message")
      this.chats.push(JSON.parse(message.body));
    });
  }


  setDefault() {
    $(".chatbox").slideToggle();
  }

  sendMessage(messageInput) {
    
     this.stompClient.send(`/app/chat/${this.friendProfile.userId}/${this.chatroomId}`, {}, JSON.stringify({ message:messageInput.value, userId: this.userId }));
     messageInput.value="";
  }



  gotoChatroom(id, friendProfile) {
    this.friendProfile = friendProfile;
  
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








}
