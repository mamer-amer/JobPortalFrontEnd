import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { NavbarService } from '../navbar.service';
import { ToastrService } from 'ngx-toastr';
import { TenderService } from '../Services/tender.service';
import { Tender } from '../tender/tender-form/tender';

import { NzModalService } from 'ng-zorro-antd';
import { ApplicantServiceService } from '../Services/applicant-service.service';
@Component({
  selector: 'app-tender-public',
  templateUrl: './tender-public.component.html',
  styleUrls: ['./tender-public.component.css']
})
export class TenderPublicComponent implements OnInit {
  empty = false;
  userType = sessionStorage.getItem('userType');
  companyId: any;
  isVisible:any=false;
  tenderIdforinvitation:any;
  candidatesArrays = []
  values = '';

  page = 1;
  public total: any;
  itemsPerPage: any;
  userId = sessionStorage.getItem('userId')
  tenders = [];
  constructor(private toastService: ToastrService,private tenderservice: TenderService, private navbar: NavbarService, private router: Router, private modalService: NzModalService, private service: ApplicantServiceService) {


  }

  ngOnInit() {
    this.navbar.showNav();
    this.gettender();
    // this.companyId = this.activatedRoute.snapshot.params.id;
  }

  lstTender = [];
  gettender(): void {


    console.log("geting all tneder = ");
    if (this.userType == "employer") {
      this.tenderservice.getAllTendersByUser(this.userId).subscribe(res => {
        // debugger;

        this.tenders = res
        console.log("Respone tender ", res);

      }, error => {

      });
    }

    else {
      this.tenderservice.getAllPublicTenders().subscribe(res => {
        // debugger;

        this.tenders = res
        console.log("Response tender ", res);

      }, error => {

      });
    }


  }

  routeToCompanyProfile = (id) => this.router.navigate(['companyProfileDetails/' + id]);

  routeToTenderDetail = (tenderid) => this.router.navigate(['tender-details/' + tenderid]);

  addtender() {
    this.router.navigate(['addtender/']);
  }

  showDeleteConfirm(tenderId: any): void {
    this.modalService.confirm({
      nzTitle: 'work in progress...',
      // nzTitle: 'Are you sure you want to delete?',
      nzContent: '<b style="color: red;">Press Ok to delete and cancel to reject</b>',
      nzOkText: 'Yes',
      nzOkType: 'danger',
      nzOnOk: () => {
        this.deleteJob(tenderId)
      },
      nzCancelText: 'No',
      nzOnCancel: () => {
        // window.history.go(-1);
      }
    });
  }

  deleteJob(tenderId: any) {
    console.log("delete id", tenderId)

    // this.service.deleteJob(id, page - 1,this.privateJobs).subscribe(res => {
    //   if (res.status == 200) {
    //     this.toastService.info('Deleted')
    //     //  this.allJobs.slice(index,1);

    //   }

    // }), error => {
    //   this.toastService.error('Failed')
    // }
  }
  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
  Invitetojobbid(tenderId:any){
    this.isVisible=true;
    this.tenderIdforinvitation=tenderId;
    console.log(this.tenderIdforinvitation)
  }

  // search work

  search(event: any) { // without type info
    this.candidatesArrays = [];
    this.values = event;
    console.log(this.values);
    if (this.values != null && this.values != "" && this.values.length>2)
      this.getAllProfiles(this.values);
  }

  getAllProfiles(value) {
    // this.candidatesArrays = [];
    this.service.getSearchCandidatesProfile(value).subscribe(res => {
      console.log(res);
     
      this.candidatesArrays = [];
      res.result.map(d => {
        this.candidatesArrays.push({
          profileId: d.profileId?d.profileId:null,
          userId: d.userId,
          name: d.name,
          dp: d.dp?d.dp:null,
          userType: d.userType
        });
      });
      // }

    });

    console.log(this.candidatesArrays)
  }

  InviteTojobBid(user,inp) {
    inp.value="";
    console.log(user,"==========")
    console.log(user);
    let obj:any={
      recruiterUserId:user.profileId,
      employerUserId:JSON.parse( this.userId),
      tenderId:this.tenderIdforinvitation

    }
    console.log(obj)
    this.tenderservice.inviteToRecruiterOnPublicTender(obj).subscribe(data=>{
      if(data.status==200){
        this.toastService.info("Success","Invitation Sent")
        this.isVisible=false;

      }else{
        this.toastService.error("Error","Cannot Send Invitation")
      }
    })
    // if (user.userType == "candidate") {    
    //   this.router.navigate(['/viewprofile/'+user.userId]);
    // }
    // else {
    //   this.router.navigate(['/companyProfileDetails/' + user.profileId])
    // }
  }
  gotoProfile(a){
    console.log(a)
  }

}
