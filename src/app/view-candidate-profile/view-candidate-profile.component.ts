import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ApplicantServiceService } from '../Services/applicant-service.service';

@Component({
  selector: 'app-view-candidate-profile',
  templateUrl: './view-candidate-profile.component.html',
  styleUrls: ['./view-candidate-profile.component.css']
})
export class ViewCandidateProfileComponent implements OnInit {
  firstname: any;
  lastname: any;

  public constructor(private activatedRoute: ActivatedRoute,private service:ApplicantServiceService) {
   
  }

  ngOnInit(): void {

    this.activatedRoute.queryParamMap.subscribe((params) => {
      console.log(params.get('candidateId'));
        
    });

    this.service.getObject.subscribe(d=>{
      console.log("Men idhr hun",d)
    })
  }

}
