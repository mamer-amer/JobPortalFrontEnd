import { Component, OnInit, ViewChild } from '@angular/core';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { NavbarService } from '../navbar.service';
import { IImage } from 'ng-simple-slideshow';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent implements OnInit {

  userType;
  userTypes: Array<any>;
  selectedValue: any;
  imageSources: (string | IImage)[] = [
    { url: 'https://cdn.vox-cdn.com/uploads/chorus_image/image/56748793/dbohn_170625_1801_0018.0.0.jpg', caption: 'The first slide', href: '#config' },
    { url: 'https://cdn.vox-cdn.com/uploads/chorus_asset/file/9278671/jbareham_170917_2000_0124.jpg' },
    { url: 'https://cdn.vox-cdn.com/uploads/chorus_image/image/56789263/akrales_170919_1976_0104.0.jpg'},
    {url:'../assets/images/slide1.jpg'},
    {url:'../assets/images/slide2.jpg'},
    {url:'../assets/images/slide3.jpg'},
    { url: '../assets/images/slide4.jpg', caption:'jobs' }
  ];
  height: string = '600px';
  minHeight: string;
  arrowSize: string = '30px';
  showArrows: boolean = true;
  disableSwiping: boolean = false;
  autoPlay: boolean = true;
  autoPlayInterval: number = 3333;
  stopAutoPlayOnSlide: boolean = true;
  debug: boolean = false;
  backgroundSize: string = 'cover';
  backgroundPosition: string = 'center center';
  backgroundRepeat: string = 'no-repeat';
  showDots: boolean = true;
  dotColor: string = '#FFF';
  showCaptions: boolean = true;
  captionColor: string = '#FFF';
  captionBackground: string = 'rgba(0, 0, 0, .35)';
  lazyLoad: boolean = false;
  hideOnNoSlides: boolean = false;
  width: string = '100%';
  fullscreen: boolean = false;
  enableZoom: boolean = false;
  enablePan: boolean = false;
  noLoop: boolean = false;
  constructor(public service: ApplicantServiceService, private navbar: NavbarService) { }
  
  ngOnInit(): void {
    this.userTypes = [
      { value: 'employer', viewValue: 'Employer' },
      { value: 'candidate', viewValue: 'Candidate' },
      { value: 'recruiter', viewValue: 'Recruiter' },
    ];
    this.navbar.showNav()
    this.userType = sessionStorage.getItem('userType');
  }

  clear() {
    sessionStorage.clear();
  }
}
