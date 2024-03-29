import { GoogleMapForMeetingComponent } from './google-map-for-meeting/google-map-for-meeting.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { RegisterComponent } from './register/register.component';
import { CandidateProfileComponent } from './candidate-profile/candidate-profile.component';
import { EmployeeProfileComponent } from './employee-profile/employee-profile.component';
import { AllJobsComponent } from './all-jobs/all-jobs.component';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { JobDetailsComponent } from './job-details/job-details.component'
import { ErrorPageComponent } from './error-page/error-page.component';
import { CompanyProfileDetailsComponent } from './company-profile-details/company-profile-details.component'
import { AppliedCandidatesProfilesComponent } from './applied-candidates-profiles/applied-candidates-profiles.component';
import { ViewCandidateProfileComponent } from './view-candidate-profile/view-candidate-profile.component';
import { AuthGuard } from './auth.guard'
import { ViewPrivateJobComponent } from './view-private-job/view-private-job.component';
import { SearchForCandidatesComponent } from './search-for-candidates/search-for-candidates.component';
import { GlobalSearchComponent } from './global-search/global-search.component';
import { ChatComponent } from './chat/chat.component';
import { ChatPopUpBottomComponent } from './chat-pop-up-bottom/chat-pop-up-bottom.component';
import { InvitationComponent } from './invitation/invitation.component';
import { MeetingInviteComponent } from './meeting-invite/meeting-invite.component';
import { TenderFormComponent } from './tender/tender-form/tender-form.component';
import { TenderdetailsComponent } from './tender-details/tenderdetails/tenderdetails.component';
import { TenderPublicComponent } from './tender-public/tender-public.component';
const routes: Routes = [
  { path: '', component: LoginPageComponent },
  { path: "register", component: RegisterComponent },
  {
    path: "candidateProfile",
    component: CandidateProfileComponent,
    canActivate: [AuthGuard],
    data: { "candidate": true }
  },
  {
    path: "employee/postjob",
    component: EmployeeProfileComponent,
    canActivate: [AuthGuard],
    data: { "employer": true, "recruiter": true }
  },
  {
    path: "allJobs",
    component: AllJobsComponent,
    canActivate: [AuthGuard],
    data: { "employer": true, "candidate": true, "recruiter": true}
  },
  {
    path: "companyProfile",
    component: CompanyProfileComponent,
    canActivate: [AuthGuard],
    data: { "employer": true ,"recruiter":true}
  },
  {
    path: "job/:id",
    component: JobDetailsComponent,
    canActivate: [AuthGuard],
    data: { "employer": true, "candidate": true, "recruiter": true }
  },
  {
    path: "privatejob/:id",
    component: ViewPrivateJobComponent,
    canActivate: [AuthGuard],
    data: {"recruiter": true,"candidate":true }
  },
  {
    path: 'companyProfileDetails/:id',
    component: CompanyProfileDetailsComponent,
    canActivate: [AuthGuard],
    data: { "candidate": true, "employer": true, "recruiter": true }
  },
  {
    path: 'globalSearch',
    component: GlobalSearchComponent
  },
  { path: "appliedcandidates/:id", component: AppliedCandidatesProfilesComponent },
  { path: "viewprofile", component: ViewCandidateProfileComponent},
  { path: "allcandidates", component: SearchForCandidatesComponent },
  { path: "chat", component: ChatComponent },
  { path: "popup", component: ChatPopUpBottomComponent , data: { "candidate": true, "employer": true, "recruiter": true }},
  { path: "invitation", component: InvitationComponent , data: { "candidate": true, "employer": true, "recruiter": true }},
  { path: "meetingMap/:meetingId", component: GoogleMapForMeetingComponent , data: { "candidate": true, "employer": true, "recruiter": true }},
  {path:"meeting-invite/:id",component:MeetingInviteComponent},
  {path:"addtender",component:TenderFormComponent},
  {path:"addtender/:id/:userId",component:TenderFormComponent},
  {path:"tender-details/:id",component:TenderdetailsComponent},
  {path:"publictender",component:TenderPublicComponent},


  { path: '**', component: ErrorPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ onSameUrlNavigation: 'reload', useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
