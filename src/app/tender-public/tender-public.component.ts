import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { NavbarService } from '../navbar.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tender-public',
  templateUrl: './tender-public.component.html',
  styleUrls: ['./tender-public.component.css']
})
export class TenderPublicComponent implements OnInit {
  heroes = ['Windstorm', 'Bombasto', 'Magneta', 'Tornado','4'];
  empty = false;
  
  page = 1;
  public total: any;
  itemsPerPage: any;
  
    constructor(private navbar : NavbarService) {

     }
  
    ngOnInit() {
      this.navbar.showNav();
    }
  
  }
  