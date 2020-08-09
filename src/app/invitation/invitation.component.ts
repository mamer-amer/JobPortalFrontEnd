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
  projectOption :any
  constructor(private nav:NavbarService,private service:ApplicantServiceService,private router:Router) { }

  ngOnInit(): void {
    this.projectOption = [
      {id:'all',Name:'All'},
      {id:'accepted',Name:'Accepted'},
      {id:'pending',Name:'Pending'},
      {id:'pendingforapproval',Name:'Pending for approval'},
  
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
  accept(meetingID){
      this.service.acceptInvitation(meetingID).subscribe(res=>{
        if(res){
          this.getAllInvitations(undefined);
        }
      })
  }

  decline(meetingID){
    this.service.declineInvitation(meetingID).subscribe(res=>{
      if(res){
        this.getAllInvitations(undefined);
      }
    })
  }

  goToGoogleMap(meetingId){
    if(this.selectedInviation=="accepted" && this.allInvitations){
      this.router.navigate(['/meetingMap/'+meetingId])
    }
  }
}
