import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { RegisterComponent } from './register/register.component';
import { CandidateProfileComponent } from './candidate-profile/candidate-profile.component';
import { EmployeeProfileComponent } from './employee-profile/employee-profile.component';
import { AllJobsComponent } from './all-jobs/all-jobs.component';
import { EmployeeMyjobsComponent } from './employee-myjobs/employee-myjobs.component'
import { EmployeeAlljobsComponent } from './employee-alljobs/employee-alljobs.component'
import { CompanyProfileComponent } from './company-profile/company-profile.component';


const routes: Routes = [
  { path: '', component: LoginPageComponent },
  { path: "register", component: RegisterComponent },
  { path: "candidateProfile", component: CandidateProfileComponent },
  { path: "employee/postjob", component: EmployeeProfileComponent },
  { path: "employee/alljobs", component: EmployeeAlljobsComponent },
  { path: "employee/myjobs", component: EmployeeMyjobsComponent },
  { path: "allJobs", component: AllJobsComponent },
  { path: "companyProfile", component: CompanyProfileComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
