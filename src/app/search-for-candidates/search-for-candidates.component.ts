import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { NavbarService } from '../navbar.service';

@Component({
  selector: 'app-search-for-candidates',
  templateUrl: './search-for-candidates.component.html',
  styleUrls: ['./search-for-candidates.component.css']
})
export class SearchForCandidatesComponent implements OnInit {

  candidatesArrays: any = [];
  editField: string;
  userType = sessionStorage.getItem('userType');
  searchValue : string;

  constructor(private _router: Router, public service: ApplicantServiceService, private activatedRoute: ActivatedRoute, private router: Router, private nav: NavbarService) { }
  dataSource: any;

  ngOnInit(): void {
    this.nav.showNav();
    this.activatedRoute.queryParamMap.subscribe(params=>{
      console.log(params);
      this.searchValue = params.get('search')
      this.getAllProfiles(this.searchValue);
    });
 

  } 
  getAllProfiles(value) {
    this.candidatesArrays = [];
    this.service.getSearchCandidatesProfile(value).subscribe(res => {
      console.log(res);
      res.result.map(d => {
        this.candidatesArrays.push({
          candId: d.id,
          userId: d.user.id,
          name: d.user.name,
          email: d.user.email,
          field: d.field,
          profileActive: d.user.profileActive == true ? "Active" : "Inactive",
          presentationLetter: d.presentationLetter,
          cv: d.cv,
          dp: d.dp,
          imageContentType: d.imageContentType,
          resumeContentType: d.resumeContentType,

        });
      });
    });

    console.log(this.candidatesArrays)
  }

  gotoViewProfile(id: any) {

    this.service.passObject(this.candidatesArrays[id]);
    let userId = this.candidatesArrays[id]['userId']
    let candId = this.candidatesArrays[id]['candId'];
    this.router.navigate(['/viewprofile'], { queryParams: { "candId": candId, "userId": userId } })
  }

}
