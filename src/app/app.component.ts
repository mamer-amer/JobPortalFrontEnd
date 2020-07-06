import { Component } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  id = sessionStorage.getItem("userId");
hidePopup=false;
  constructor(location: Location, router: Router) {
    router.events.subscribe((val) => {
      if(location.path() != '' && location.path().slice(0,5)=='/chat'){
      this.hidePopup=true;
     
      
      }
      else {
        this.hidePopup=false;
      }
    });
  }
  ngDoCheck(){
 
    this.id=sessionStorage.getItem("userId")
  }
}
