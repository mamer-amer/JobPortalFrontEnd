import { Component, OnInit } from '@angular/core';
import { Candidate } from '../candidate-profile/candidate';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { Action } from 'rxjs/internal/scheduler/Action';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table'

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
  constructor(public service: ApplicantServiceService, private activatedRoute: ActivatedRoute) { }
  dataSource: any;

  ngOnInit(): void {

    this.getParams();
    this.getAllProfiles(this.jobId);

  }



back(){
  window.history.go(-1);
}

  getAllProfiles(id) {

    this.service.getAppliedCandidatesProfile(id).subscribe(res => {
      console.log(res);
      res.result.map(d => {
        this.candidatesArrays.push({
          id: d.id,
          name:d.user.name,
          email:d.user.email,
          field: d.field,
          profileActive: d.user.profileActive,
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

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //  this.candidatesArrays =  this.candidatesArrays.filter(d=>{
  //    return d==filterValue.toLowerCase();
     
  //  })
  

  // }

  getParams() {
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.jobId = params.get('id');
      console.log(params);

    });

  }

  gotoViewProfile(id:any){
    console.log(this.candidatesArrays[id]);
  }

}
