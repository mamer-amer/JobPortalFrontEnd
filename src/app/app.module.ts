import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import { LoginPageComponent } from './login-page/login-page.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatBadgeModule} from '@angular/material/badge';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {MatCardModule} from '@angular/material/card';
import { CommonModule, registerLocaleData } from '@angular/common';
import {MatTableModule} from '@angular/material/table';

import { NoopInterceptor } from './request.intercept';
import {MatDialogModule} from '@angular/material/dialog';

import {MatIconModule} from '@angular/material/icon';

import {MatDividerModule} from '@angular/material/divider';

import { DropdownModule } from 'primeng/dropdown';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { ExportAsModule } from 'ngx-export-as';
import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import en from '@angular/common/locales/en';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
registerLocaleData(en);
import {MatRadioModule} from '@angular/material/radio';
import { RegisterComponent } from './register/register.component';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { CandidateProfileComponent } from './candidate-profile/candidate-profile.component';
import { EmployeeProfileComponent } from './employee-profile/employee-profile.component';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { AllJobsComponent } from './all-jobs/all-jobs.component';
import { EmployeeMyjobsComponent } from './employee-myjobs/employee-myjobs.component';
import { EmployeeAlljobsComponent } from './employee-alljobs/employee-alljobs.component';

// import {AgmCoreModule} from '@agm/core'


// import {MatPaginator} from '@angular/material/paginator';
// import {MatTableDataSource} from '@angular/material/table';
// import {MatGridListModule} from '@angular/material/grid-list';
@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    RegisterComponent,
    CandidateProfileComponent,
    EmployeeProfileComponent,
    AllJobsComponent,
    EmployeeMyjobsComponent,
    EmployeeAlljobsComponent
    
  ],
  imports: [
    NzUploadModule, 
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatBadgeModule,
    FormsModule,
    HttpClientModule,
    MatCardModule,
    MatTableModule,
    MatRadioModule,
    DropdownModule,
    MatDialogModule,  

    MatDividerModule,
    NgbModule,
    MatIconModule,
    MatPaginatorModule,
    MatDividerModule,
    MatSnackBarModule,
    ExportAsModule,
    NgZorroAntdModule,
    NzDatePickerModule,
    NzTimePickerModule,
    NzButtonModule,
    NzMessageModule,
    NzResultModule,
    NzAvatarModule,
    NzBadgeModule ,
    NgxMaterialTimepickerModule,
   
    
    // MatGridListModule
  ],
  providers: [
    MatDatepickerModule,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NoopInterceptor,
      multi: true
    },
    { provide: NZ_I18N, useValue: en_US },
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
