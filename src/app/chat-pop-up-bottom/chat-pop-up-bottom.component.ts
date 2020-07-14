import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as $ from 'jquery';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { environment } from 'src/environments/environment';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
@Component({
  selector: 'app-chat-pop-up-bottom',
  templateUrl: './chat-pop-up-bottom.component.html',
  styleUrls: ['./chat-pop-up-bottom.component.css']
})
export class ChatPopUpBottomComponent implements OnInit {
  $: any;
  id = sessionStorage.getItem("userId");
  chatrooms: Array<any> = [];
  messageBoxes: Array<any> = [];
  chats = [];
  private stompClient;
  // @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  scrollTop: number = null;
  styleArray = [
    { position: 'fixed', bottom: '0%', right: '0px' },
    { position: 'fixed', bottom: '0%', right: '245px' },
    { position: 'fixed', bottom: '0%', right: '490px' }
  ]
  constructor(private service: ApplicantServiceService) { }

  ngOnInit(): void {
    this.initializeWebSocketConnection()
    let that = this;
    $(".chat_content").slideToggle("slow");
    // $(".message_box").hide();s

    $(".chat_header").click(function () {
      $(".chat_content").slideToggle("slow");
      that.getChantrooms();
    });

  }

  initializeWebSocketConnection() {
    const url = environment.baseUrl;
    let ws = new SockJS(url + "ws");
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, function (frame) {



    });
  }
  openGlobalSocket(chatroomId) {
    let that = this;
    this.stompClient.subscribe(`/topic/chatroom/${chatroomId}`, (message) => {

      let chat = JSON.parse(message.body);
      let messageBox = this.getChatroomObject(chat.chatroomId);

      let chats = messageBox.chats;
      // chats.push(chat);
      messageBox.chats.push(chat) 
      this.replaceArray(messageBox)

      setTimeout(()=>this.scrollToBottom(chat.chatroomId),100)


    },{id:chatroomId});
  }

  sendMessage(messageInput, friendId, chatroomId) {
    if (messageInput.value.length > 0) {

      this.stompClient.send(`/app/chat/${friendId}/${chatroomId}`, {}, JSON.stringify({ message: messageInput.value, userId: this.id }));
      messageInput.value = "";
     
      // this.messageSend = true;
    }

  }
  newChatBox(user) {
    if (!this.contains(user.userId) && this.messageBoxes.length <= 3) {
      // this.messageBoxes.push(chatroom);


      this.initiateChat(user)
      this.getChantrooms()

    }
  }
  removeMessageBox(id,chatroomId) {
    this.stompClient.unsubscribe(chatroomId);
    this.messageBoxes.splice(id, 1)
  }
  getChantrooms() {
    this.service.getAllChatrooms(this.id)
      .subscribe((res) => {
        this.chatrooms = res;
        console.log(res)
      })
  }
  toggle(i, friend,chatroomId) {
    console.log(friend)
    // this.initiateChat(friend);
    this.resetAllChats(chatroomId,friend.userId);
    $(`.mc${i}`).slideToggle("slow");
  }

 
  initiateChat(user) {
    this.service.initiateChat(this.id, user.userId)
      .subscribe((chatroomId) => {
        this.getAllChats(chatroomId, user)
      })
  }
  getAllChats(chatroomId, user) {
    this.service.getAllChatroomChats(chatroomId,user.userId)
      .subscribe((res) => {
        console.log(res)
        this.chats = res

        this.openGlobalSocket(chatroomId)
        this.messageBoxes.push({
          chats: res,
          user,
          chatroomId
        })

        setTimeout(()=>{
          this.scrollToBottom(chatroomId)
        },100)
   
      

      })
  }

  resetAllChats(chatroomId,friendId){
    this.service.getAllChatroomChats(chatroomId,friendId)
    .subscribe((res) => {
      console.log(res)
      this.chats = res

      this.openGlobalSocket(chatroomId)
     

     this.messageBoxes=this.messageBoxes.map((mb)=>{
      if(mb.chatroomId==chatroomId)
      {
        mb.chats=res;
        return mb;
      }
      else return mb;
     })
 

    })
  }

  
  ngOnDestroy(){
    if(this.stompClient)
    {
      console.log("unsubscribeddddd")
   this.stompClient.unsubscribe()
    }
  }
 
  contains(id) {
    return this.messageBoxes.find((mb) => mb.user.userId == id);
  }

  getChatroomObject(chatroomId) {
    return this.messageBoxes.find(mb => mb.chatroomId == chatroomId);
  }

  replaceArray(messageBox) {
    this.messageBoxes.map((mb) => {

      if (messageBox.chatroomId == mb.chatroomId)
        return messageBox;
      else
        return mb;
    })
  }

  scrollToBottom(chatroomId){
   
   let messages = document.getElementById(`chat${chatroomId}`);
   messages.scrollTop = messages.scrollHeight;
   
  }
  
}




