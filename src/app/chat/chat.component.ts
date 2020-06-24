import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
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
  chatroomId;
  chatrooms = []
  dp=sessionStorage.getItem("dp")
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  constructor(private navService: NavbarService, private activatedRoute: ActivatedRoute, private service: ApplicantServiceService, private router: Router) {

    this.activatedRoute.params.subscribe(params => {

      console.log(params, "=======params")
      let { chatroom } = params;
      if (chatroom) {
        this.chatroomId = chatroom;


      }

    });
    this.initializeWebSocketConnection();

  }

  ngOnInit(): void {
    this.navService.showNav();
    // this.getAllFriends(this.userId)
    this.getAllChatrooms(this.userId);
   


  }

  initializeWebSocketConnection() {
    const url = environment.baseUrl;
    let ws = new SockJS(url + "ws");
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, function (frame) {

      that.openGlobalSocket()
      that.openReceiverSocket();
    });
  }
  openGlobalSocket() {
    let that = this;
    this.stompClient.subscribe(`/topic/chatroom/${this.chatroomId}`, (message) => {
      console.log(JSON.parse(message.body), "   =========message")
      this.chats.push(JSON.parse(message.body));
      this.scrollToBottom();
      //  that.getAllChatrooms(that.userId)
    });
  }

  openReceiverSocket() {
    let that = this;
    this.stompClient.subscribe(`/topic/chat/${this.userId}`, (message) => {
      //  that.getAllFriends()
      that.getAllChatrooms(that.userId)
    });
  }


  setDefault() {
    $(".chatbox").slideToggle();
  }

  sendMessage(messageInput) {

    this.stompClient.send(`/app/chat/${this.friendProfile.userId}/${this.chatroomId}`, {}, JSON.stringify({ message: messageInput.value, userId: this.userId }));
    messageInput.value = "";
  }

  getAllChatrooms(id) {
    this.service.getAllChatrooms(id)
      .subscribe((response) => {
        console.log(response, "=========")
        this.chatrooms = response;
      })
  }

  gotoChatroom(id, friendProfile) {
    this.chats = []
    this.friendProfile = friendProfile;

    this.service.initiateChat(this.userId, id)
      .subscribe((res) => {
        console.log(res)
        this.getAllChats(res);
        this.router.navigate(["chat/" + res])
      })


  }
  getAllChats(chatroom) {
    this.service.getAllChatroomChats(chatroom, this.friendProfile.userId)
      .subscribe((res) => {
        console.log(res)

        this.chats = res
        this.scrollToBottom();
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



  refreshChatrooms() {
    this.getAllChatrooms(this.userId);
  }

  ngAfterViewChecked() {        
    this.scrollToBottom();        
} 

scrollToBottom(): void {
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }                 
}


}
