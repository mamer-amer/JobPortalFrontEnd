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

  profileView(user,inp) {
    inp.value="";
    console.log(user,"==========")
    console.log(user);
    if (user.userType == "candidate") {    
      this._router.navigate(['/viewprofile'], { queryParams: { "candId": user.profileId?user.profileId:0, "userId": user.userId } })
    }
    else {
      this._router.navigate(['/companyProfileDetails/' + user.profileId])
    }
  }
  gotoProfile(a){
    console.log(a)
  }

}
