import { Injectable } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';

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
