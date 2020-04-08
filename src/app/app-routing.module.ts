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
import {CompanyProfileDetailsComponent} from './company-profile-details/company-profile-details.component'
import { AppliedCandidatesProfilesComponent } from './applied-candidates-profiles/applied-candidates-profiles.component';
import { ViewCandidateProfileComponent } from './view-candidate-profile/view-candidate-profile.component';

const routes: Routes = [
  { path: '', component: LoginPageComponent },
  { path: "register", component: RegisterComponent },
  { path: "candidateProfile", component: CandidateProfileComponent },
  { path: "employee/postjob", component: EmployeeProfileComponent },
  { path: "allJobs", component: AllJobsComponent },
  { path: "companyProfile", component: CompanyProfileComponent },
  { path: "job/:id", component: JobDetailsComponent },
  {path:'companyProfileDetails/:id',component:CompanyProfileDetailsComponent},
  {path:"appliedcandidates/:id",component:AppliedCandidatesProfilesComponent},
  { path:"viewprofile",component:ViewCandidateProfileComponent},

  { path: '**', component: ErrorPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
