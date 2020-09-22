import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tender-public',
  templateUrl: './tender-public.component.html',
  styleUrls: ['./tender-public.component.css']
})
export class TenderPublicComponent implements OnInit {
  heroes = ['Windstorm', 'Bombasto', 'Magneta', 'Tornado','4'];
    constructor() {

     }
     page = 1;
  public total: any;
  itemsPerPage: any;
  
    ngOnInit() {
    }
  
  }
  