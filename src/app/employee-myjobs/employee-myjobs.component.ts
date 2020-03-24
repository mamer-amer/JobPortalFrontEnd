import { Component, OnInit } from '@angular/core';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-employee-myjobs',
  templateUrl: './employee-myjobs.component.html',
  styleUrls: ['./employee-myjobs.component.css']
})
export class EmployeeMyjobsComponent implements OnInit {
  userId: any;
  constructor(public service:ApplicantServiceService,private _location:Location) { }

  ngOnInit(){
    this.getPostedJobsByCompany();
  }

  getPostedJobsByCompany() {
    this.checkUserId();
    this.service.getJobsByEmployeeId(this.userId).subscribe(res => {
      console.table(res);
    });
  }

  checkUserId() {
    const id = sessionStorage.getItem('userId');
    if (id != null) {
      this.userId = id;
    }
  

  }


    back(){
      history.go(-1);
    }
    
  


}
