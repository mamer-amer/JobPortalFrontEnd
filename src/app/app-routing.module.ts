import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { RegisterComponent } from './register/register.component';
import { CandidateProfileComponent } from './candidate-profile/candidate-profile.component';
import { EmployeeProfileComponent } from './employee-profile/employee-profile.component';
import { AllJobsComponent } from './all-jobs/all-jobs.component';


const routes: Routes = [
  {
    path:'',component: LoginPageComponent
  },{
    path:"register",component:RegisterComponent
  },
  {
    path:"candidateProfile",component:CandidateProfileComponent
  },{
    path:"employeeProfile",component:EmployeeProfileComponent
  },
   {
    path: "allJobs", component: AllJobsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
