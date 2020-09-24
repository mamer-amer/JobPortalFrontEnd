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

  employername: any;
  employercompanyName: any;
  employercompanyemail: any;
  employercompanyimage: any;
  companyemail: any;
  tenderobj: Tender = new Tender();
  tenderId: any;
  userType = sessionStorage.getItem('userType')
  userId = sessionStorage.getItem('userId');
  companyName = sessionStorage.getItem('companyName');
  email = sessionStorage.getItem('email');
  username = sessionStorage.getItem('username');
  tenders: any[] = [];
  employerId: any;
  btnApplied = false;

  constructor(private toastService: ToastrService, private tenderservice: TenderService, private navbar: NavbarService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.tenderId = this.activatedRoute.snapshot.params['id'];
    console.log(this.tenderId);
    this.navbar.showNav();
    this.getAllTender(this.tenderId);

  }
  getAllTender(tenderId: any) {
    this.tenderservice.gettenderbyid(this.tenderId).subscribe(res => {
      console.log("tender-details", res);
      this.tenderobj = res.tenderDTO;
      this.employerId = res.userDto.id;
      this.employercompanyName = res.userDto.name;
      this.employercompanyemail = res.userDto.email;
      this.employercompanyimage = res.userDto.companyProfile.logo;
      //  this.employername=res.userDto.companyProfile.
    })
  }


  acceptOrDeclineTender(isApplied:boolean){
     const tenderDto = new Tender();
     tenderDto.recruiterUserId = this.userId;
     tenderDto.employerUserId = this.employerId;
     tenderDto.tenderType = this.tenderobj.tenderType;
     tenderDto.id = this.tenderobj.id;
     console.log("TENDER DTO ",tenderDto)
     this.tenderservice.acceptOrDeclineTender(tenderDto,isApplied).subscribe(res=>{
       this.btnApplied = true;   
       isApplied==true?this.toastService.success("Tender successfully accepted"):this.toastService.warning("Tender decline");
       
          
     }),error=>{
       this.toastService.error('Failed to accept this tender');
     }
     
  }
}
