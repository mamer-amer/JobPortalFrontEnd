import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { NavbarService } from '../navbar.service';
import { ToastrService } from 'ngx-toastr';
import { TenderService } from '../Services/tender.service';
import { Tender } from '../tender/tender-form/tender';

@Component({
  selector: 'app-tender-public',
  templateUrl: './tender-public.component.html',
  styleUrls: ['./tender-public.component.css']
})
export class TenderPublicComponent implements OnInit {
  heroes = ['Windstorm', 'Bombasto', 'Magneta', 'Tornado','4'];
  empty = false;
  userType = sessionStorage.getItem('userType');
  
  page = 1;
  public total: any;
  itemsPerPage: any;
  

  tenders = [];
    constructor(private tenderservice:TenderService ,private navbar : NavbarService,private router: Router) {
     

     }
  
    ngOnInit() {
      this.navbar.showNav();
      this.gettender();
    }

    lstTender =[];
    gettender():void{


        console.log("geting all tneder = ");
        this.tenderservice.getAllPublicTenders().subscribe(res=>{
          // debugger;

          this.tenders = res
            console.log("Respone tender " ,res);
            
        },error=>{

        });

    }

    routeToCompanyProfile = (id) => this.router.navigate(['companyProfileDetails/' + id]);

    routeToTenderDetail =(tenderid) => this.router.navigate(['tender-details/'+tenderid]);

  
  }
  