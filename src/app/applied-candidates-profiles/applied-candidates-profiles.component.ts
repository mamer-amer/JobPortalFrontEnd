import { Component, OnInit } from '@angular/core';
import { Candidate } from '../candidate-profile/candidate';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { Action } from 'rxjs/internal/scheduler/Action';
import { ActivatedRoute, ParamMap, Router, NavigationExtras } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table'

import { NavbarService } from '../navbar.service';

@Component({
  selector: 'app-applied-candidates-profiles',
  templateUrl: './applied-candidates-profiles.component.html',
  styleUrls: ['./applied-candidates-profiles.component.css']
})
export class AppliedCandidatesProfilesComponent implements OnInit {

  candidatesArrays: any = [];
  editField: string;
  userType = sessionStorage.getItem('userType');
  jobId: any;
  constructor(private _router: Router, public service: ApplicantServiceService, private activatedRoute: ActivatedRoute, private router: Router, private nav: NavbarService) { }
  dataSource: any;

  ngOnInit(): void {
    this.nav.showNav()

    this.getParams();



  }



  back() {
    window.history.go(-1);
  }

  getAllProfiles(id) {
    this.candidatesArrays = [];
    this.service.getAppliedCandidatesProfile(id).subscribe(res => {
      console.log(res);
      res.result.map(d => {
        this.candidatesArrays.push({
          userId: d.id,
          name: d.name,
          email: d.email,
          profileActive: d.profileActive == true ? "Active" : "Inactive",

        });
      });
    });

    console.log(this.candidatesArrays)
  }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //  this.candidatesArrays =  this.candidatesArrays.filter(d=>{
  //    return d==filterValue.toLowerCase();

  //  })


  // }

  getParams() {
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.jobId = params.get('id');
      this.getAllProfiles(this.jobId);

    });

  }

  gotoViewProfile(id: any) {

    this.service.passObject(this.candidatesArrays[id]);
    let userId = this.candidatesArrays[id]['userId']
    this.router.navigate(['/viewprofile/'+userId])
  }

}
