import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { NavbarService } from '../navbar.service';
import { Candidate, ViewCandidateObject } from '../candidate-profile/candidate';
import { reject } from 'q';
import { resolve } from 'path';

@Component({
  selector: 'app-view-candidate-profile',
  templateUrl: './view-candidate-profile.component.html',
  styleUrls: ['./view-candidate-profile.component.css']
})
export class ViewCandidateProfileComponent implements OnInit {
  firstname: any;
  lastname: any;
  candidateObj:any;
  name:any;
  userId: string;

  public constructor(private activatedRoute: ActivatedRoute,private service:ApplicantServiceService,public nav:NavbarService) {
   
  }

  ngOnInit(): void {

    

    this.nav.showNav();
    this.getParams();
    this.catchParams().then((result)=>{
        if(result){
          this.getCandidateProfile(this.userId);
        }
    },(error)=>{
      console.log(error);
    })
   
  
  }

 
 
  getCandidateProfile(userId) {
    this.service.getCandidateProfileForView(userId).subscribe(d=>{
      this.candidateObj  = d;
      console.log(this.candidateObj);
       const {result,name,email} =  d;
       console.log(result +" " +name+" " + email)
    })
  }

  catchParams():Promise<any>{
    return new Promise(function(resolve,reject){
      resolve(true);
      });
    }


    getParams(){
      this.activatedRoute.queryParamMap.subscribe((params) => {
      this.userId = params.get('userId');
    });
    }
   

}
  
