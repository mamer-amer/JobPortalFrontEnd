import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {

    display:any;
  
  constructor() {
    this.display = false;
   }

  showNav(){
    this.display = true;
  }
  hideNav(){
     this.display = false;
  }
}
