import { Component, OnInit } from '@angular/core';
import { TenderService } from '../../Services/tender.service';
import { NavbarService } from '../../navbar.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Tender } from '../../tender/tender-form/tender';

@Component({
  selector: 'app-tenderdetails',
  templateUrl: './tenderdetails.component.html',
  styleUrls: ['./tenderdetails.component.css']
})
export class TenderdetailsComponent implements OnInit {

  employername:any;
  employercompanyName:any;
  employercompanyemail:any;
  employercompanyimage:any;
  companyemail:any;
  tenderobj:Tender=new Tender();
  tenderId:any;
  userId = sessionStorage.getItem('userId');
  companyName=sessionStorage.getItem('companyName');
  email=sessionStorage.getItem('email');
  username=sessionStorage.getItem('username');
  tenders:any[]=[];

  constructor(private toastService: ToastrService,private tenderservice:TenderService,private navbar: NavbarService,private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.tenderId = this.activatedRoute.snapshot.params['id'];
    console.log(this.tenderId);
this.navbar.showNav();
this.getAllTender(this.tenderId);

  }
  getAllTender(tenderId:any){
this.tenderservice.gettenderbyid(this.tenderId).subscribe(res=>{
  console.log("tender-details",res);
 this.tenderobj=res.tenderDTO;
 this.employercompanyName=res.userDto.name;
 this.employercompanyemail=res.userDto.email;
 this.employercompanyimage=res.userDto.companyProfile.logo;
//  this.employername=res.userDto.companyProfile.
})
  }

}
