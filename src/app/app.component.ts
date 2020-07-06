import { Component } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  id = sessionStorage.getItem("userId");

  ngDoCheck(){
    this.id=sessionStorage.getItem("userId")
  }
}
