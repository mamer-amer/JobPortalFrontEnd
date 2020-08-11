import { Router } from '@angular/router';
import { ApplicantServiceService } from './../Services/applicant-service.service';
import { NavbarService } from './../navbar.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-invitation',
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.css']
})
export class InvitationComponent implements OnInit {

  selectedInviation:any="all";
  userId = sessionStorage.getItem('userId')
  allInvitations :any=[]
  projectOption :any;

  constructor(private nav:NavbarService,private service:ApplicantServiceService,private router:Router) { }

  ngOnInit(): void {
    this.projectOption = [
      {id:'all',Name:'All'},
      {id:'accepted',Name:'Accepted'},
      {id:'completed',Name:'Completed'},
      {id:'pending',Name:'Pending'},
      {id:'approval',Name:'Pending for approval'},
      {id:'cancelled',Name:'Cancelled'},
  
    ]
    this.nav.showNav();
    this.get_Invitations_Initally();
    

  }

  getAllInvitations($event){
    console.log($event)
    this.allInvitations = []
    console.log(this.selectedInviation);
  
    this.service.getMeetingInvitations(this.selectedInviation,this.userId).subscribe(res=>{
      console.log(res);
      this.allInvitations = res;
  })
  }
  get_Invitations_Initally(){
    this.allInvitations = []
    this.service.getMeetingInvitations(this.selectedInviation,this.userId).subscribe(res=>{
      console.log(res);
      this.allInvitations = res;
  }) 
  }
  accept(meetingID,userId2){
      this.service.acceptInvitation(this.userId,userId2,meetingID).subscribe(res=>{
        if(res){
          this.getAllInvitations(undefined);
        }
      })
  }

  decline(meetingID,userId2){
    this.service.declineInvitation(this.userId,userId2,meetingID).subscribe(res=>{
      if(res){
        this.getAllInvitations(undefined);
      }
    })
  }

  goToGoogleMap(meetingId){
  
      this.router.navigate(['/meetingMap/'+meetingId])
    
  }
}
