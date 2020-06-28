import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
@Component({
  selector: 'app-chat-pop-up-bottom',
  templateUrl: './chat-pop-up-bottom.component.html',
  styleUrls: ['./chat-pop-up-bottom.component.css']
})
export class ChatPopUpBottomComponent implements OnInit {
  $: any;
  constructor() { }

  ngOnInit(): void {

    $(".chat_header").click(function () {
      $(".chat_content").slideToggle("slow");
    });

    $(".message_header").click(function () {
      $(".message_content").slideToggle("slow");
    });

    $(".close").click(function () {
      $(".message_box").hide();
    });

    $(".user").click(function () {
      $(".message_box").show();
      $(".message_content").show();
      $(".input_box").show();
    });

    $(".enter").click(function () {
      var msg = $(".message_input").val();
      if (msg != "") {
        $(".new_messages").append("<p>" + msg + "</p>");
        $(".message_input").val("");
      }
    });

  }
  }

  


