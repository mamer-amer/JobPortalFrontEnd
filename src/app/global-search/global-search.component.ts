import { Component, OnInit } from '@angular/core';
import { NavbarService } from '../navbar.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ApplicantServiceService } from '../Services/applicant-service.service';

@Component({
  selector: 'app-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.css']
})
export class GlobalSearchComponent implements OnInit {

  constructor(private _router: Router, public service: ApplicantServiceService, private activatedRoute: ActivatedRoute, private nav: NavbarService) { }
  candidatesArrays = []

  ngOnInit(): void {
  }

  values = '';

  search(event: any) { // without type info
    this.candidatesArrays = [];
    this.values = event;
    console.log(this.values);
    if (this.values != null && this.values != "")
      this.getAllProfiles(this.values);
  }

  getAllProfiles(value) {
    // this.candidatesArrays = [];
    this.service.getSearchCandidatesProfile(value).subscribe(res => {
      console.log(res);
      let object = this.candidatesArrays.find(candidate => candidate.candId == res.result.id);
      // if (object!=undefined){
      //     this.candidatesArrays.splice(object.candId,0);
      // }
      // else{
      this.candidatesArrays = [];
      res.result.map(d => {
        this.candidatesArrays.push({
          candId: d.id,
          userId: d.user.id,
          name: d.user.name,
          email: d.user.email,
          dp: d.dp,
          userType: d.user.userType


        });
      });
      // }

    });

    console.log(this.candidatesArrays)
  }

  profileView(user) {
    console.log(user);
    if (user.userType == "candidate") {
      // let queryParams = {'userId':user.userId,'candId':user.candId}
      this._router.navigate(['/viewprofile'], { queryParams: { "candId": user.candId, "userId": user.userId } })
    }
    // this._router.navigate(['/companyProfileDetails/' + user.candId])
  }

}