import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import * as $ from 'jquery';
import { NavbarService } from '../navbar.service';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { NavigationEnd, Router, Route, ActivatedRoute } from '@angular/router';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import * as moment from 'moment'
import { environment } from 'src/environments/environment';
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
  friendsTempArray = [];
  chatroomId;
  chatrooms = []
  dp = sessionStorage.getItem("dp")
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  scrollTop:number= null;
  showFriends: boolean = false;
  messageSend: true;
  constructor(private navService: NavbarService, private activatedRoute: ActivatedRoute, private service: ApplicantServiceService, private router: Router) {


    // console.log(this.activatedRoute)
    if(this.activatedRoute['snapshot'].queryParams['chatroom']){

    
    this.clearPosParam()
    
    }

  



  }

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe(params => {

      console.log(params)

      let { chatroom } = params;
      if (chatroom) {
        this.stompClient.unsubscribe(this.chatroomId);
        this.chatroomId = chatroom;
       
        this.getAllChats(chatroom);
     
      }
      this.initializeWebSocketConnection();
    });
    this.navService.showNav();
    this.getAllFriends(this.userId)
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
     
    },{id:this.chatroomId});
  }

  openReceiverSocket() {
    let that = this;
    this.stompClient.subscribe(`/topic/chat/${this.userId}`, (message) => {
    
      that.getAllChatrooms(that.userId)
    });
  }

  ngOnDestroy(){
    if(this.stompClient)
    {
      console.log("unsubscribeddddd")
   this.stompClient.unsubscribe()
    }
  }
 


  setDefault() {
    $(".chatbox").slideToggle();
  }

  writtenMessage:any;
  sendMessage(messageInput) {
    if (messageInput.innerText.length>0){
      
      this.stompClient.send(`/app/chat/${this.friendProfile.userId}/${this.chatroomId}`, {}, JSON.stringify({ message: messageInput.innerText, userId: this.userId }));
      messageInput.innerText = "";
      this.messageSend = true;
    }
   
  }

  getAllChatrooms(id) {
    this.service.getAllChatrooms(id)
      .subscribe((response) => {
        console.log(response, "=========")
        this.chatrooms = response;
      })
  }

  gotoChatroom(id, friendProfile, searchBox) {
  
    this.friendProfile = friendProfile;
    console.log(friendProfile,"============friend")
    this.onFocusOut(searchBox);
    this.service.initiateChat(this.userId, id)
      .subscribe((res) => {
        if (res != this.chatroomId) {
          this.chats = []
         console.log("came here",res)
          this.router.navigate(
            [],
            {
              relativeTo: this.activatedRoute,
              queryParams: { chatroom: res },
              queryParamsHandling: 'merge'
            });
        }
        else {
          this.getAllChats(this.chatroomId);
        }
     
       
      })


  }
  getAllChats(chatroom) {
    this.service.getAllChatroomChats(chatroom, this.friendProfile.userId)
      .subscribe((res) => {
        console.log(res)

        this.chats = res
        this.getAllChatrooms(this.userId)
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
        this.friendsTempArray = this.friends;
        console.log(this.friends, "=====")
      })


  }
  inputBoxChange(value) {
    console.log(value)

    if (value) {
      this.friends = this.friendsTempArray;
      this.friends = this.friends.filter((f) => {
        return f.name.toLowerCase().startsWith(value.toLowerCase())
      })
    }
    else {
      this.friends = this.friendsTempArray;
    }
  }
  onFocus() {
    console.log("onFocus")
    this.showFriends = true;
  }
  onFocusOut(search) {
    console.log("onFocusOut")
    search.value = ""
    this.friends = this.friendsTempArray
    this.showFriends = false;
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
    } catch (err) { }
  }

  clearPosParam() {
    this.router.navigate(
      ['.'],
      { relativeTo: this.activatedRoute }
    );
  }

  relativeTime(date){
    return moment(date).fromNow();
  }

 

  keyDownFunction(event) {
    if (event.keyCode === 13 && event.target.innerText.length>0) {
      this.stompClient.send(`/app/chat/${this.friendProfile.userId}/${this.chatroomId}`, {}, JSON.stringify({ message: event.target.innerText, userId: this.userId }));
      event.target.innerText = "";
      this.messageSend = true;
      // rest of your code
    }
  }

}
