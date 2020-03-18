import { Component, OnInit } from '@angular/core';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-all-jobs',
  templateUrl: './all-jobs.component.html',
  styleUrls: ['./all-jobs.component.css']
})
export class AllJobsComponent implements OnInit {


  constructor(private _location: Location, private service: ApplicantServiceService, private router: Router, private activateRoute: ActivatedRoute) { }

  ngOnInit(): void {
  }



  logout() {
    sessionStorage.clear();
    this.router.navigateByUrl('');
  }

  goBack() {
    this._location.back();
  }


}
