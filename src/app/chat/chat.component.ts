import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { NavbarService } from '../navbar.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  container: HTMLElement;

  constructor(private navService:NavbarService) { }

  // ngAfterViewInit() {
  //   this.container = document.getElementById("chat-panel");
  //   this.container.scrollTop = this.container.scrollHeight;
  // }

  ngOnInit(): void {
    this.navService.showNav();

    // move the new chat
    // this.setDefault();

    // $('.friend-drawer--onhover').on('click', function () {

    //   $('.chat-bubble').hide('fast').show('slow');

    // });


    // $(".btn-minimize").click(function () {
    //   $(".chatbox").slideToggle();
    // });
  }


  setDefault(){
    $(".chatbox").slideToggle();
  }


 
  


 
   
  


  getSelectUserChat(){

  }

  getAllChatsEverDone(){

  }

  callOnScroll(){

  }


  sendMessage(){

  }



  searchFriends(){
    
  }

  

}
