import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { NavbarService } from '../navbar.service';
import { ToastrService } from 'ngx-toastr';
import { TenderService } from '../Services/tender.service';
import { Tender } from '../tender/tender-form/tender';

import { NzModalService } from 'ng-zorro-antd';
@Component({
  selector: 'app-tender-public',
  templateUrl: './tender-public.component.html',
  styleUrls: ['./tender-public.component.css']
})
export class TenderPublicComponent implements OnInit {
  empty = false;
  userType = sessionStorage.getItem('userType');
  companyId : any;
  
  page = 1;
  public total: any;
  itemsPerPage: any;
  

  tenders = [];
    constructor(private tenderservice:TenderService ,private navbar : NavbarService,private router: Router,private modalService: NzModalService) {
     

     }
  
    ngOnInit() {
      this.navbar.showNav();
      this.gettender();
      // this.companyId = this.activatedRoute.snapshot.params.id;
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

    addtender(){
      this.router.navigate(['addtender/']);
    }

    showDeleteConfirm(tenderId: any): void {
      this.modalService.confirm({
        nzTitle: 'Are you sure you want to delete?',
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
      console.log("delete id",tenderId)

      // this.service.deleteJob(id, page - 1,this.privateJobs).subscribe(res => {
      //   if (res.status == 200) {
      //     this.toastService.info('Deleted')
      //     //  this.allJobs.slice(index,1);
         
      //   }
  
      // }), error => {
      //   this.toastService.error('Failed')
      // }
    }

  
  }
  