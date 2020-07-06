import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { ApplicantServiceService } from '../Services/applicant-service.service';
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
  constructor(private service: ApplicantServiceService) { }

  ngOnInit(): void {
    let that = this;
    $(".chat_content").slideToggle("slow");
    // $(".message_box").hide();s

    $(".chat_header").click(function () {
      $(".chat_content").slideToggle("slow");
      that.getChantrooms();
    });

 
    // $(".message_header").click(function () {
    //   $(`.message_content`).slideToggle("slow");
    // });
    // $(".close").click(function () {
    //   $(".message_box").hide();
    // });

    // $(".user").click(function () {
    //   $(".message_box").show();
    //   $(".message_content").show();
    //   $(".input_box").show();
    // });

  

  }
  newChatBox(chatroom){
    if(!this.messageBoxes.includes(chatroom))
    this.messageBoxes.push(chatroom);
  }
  removeMessageBox(id){
    this.messageBoxes.splice(id,1)
  }
  getChantrooms() {
    this.service.getAllChatrooms(this.id)
      .subscribe((res) => {
        this.chatrooms = res;
        console.log(res)
      })
  }
  toggle(i){
    $(`.mc${i}`).slideToggle("slow");
  }
}




