import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { LoginPageComponent } from './login-page/login-page.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatBadgeModule } from '@angular/material/badge';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { CommonModule, registerLocaleData } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NoopInterceptor } from './request.intercept';
import { MatDialogModule } from '@angular/material/dialog';

import { MatIconModule } from '@angular/material/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { MatDividerModule } from '@angular/material/divider';
import { StarRatingModule } from 'angular-star-rating';
import { DropdownModule } from 'primeng/dropdown';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ExportAsModule } from 'ngx-export-as';
import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import en from '@angular/common/locales/en';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
registerLocaleData(en);
import { MatRadioModule } from '@angular/material/radio';
import { RegisterComponent } from './register/register.component';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CandidateProfileComponent } from './candidate-profile/candidate-profile.component';
import { EmployeeProfileComponent } from './employee-profile/employee-profile.component';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { AllJobsComponent } from './all-jobs/all-jobs.component';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { JobDetailsComponent } from './job-details/job-details.component';
// import { NzResultModule } from 'ng-zorro-antd/result'; 
import { ToastrModule } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
// import { MatIconModule } from '@angular/material/icon'
import { DialogModule } from 'primeng/dialog';
import { FooterComponent } from './footer/footer.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { CompanyProfileDetailsComponent } from './company-profile-details/company-profile-details.component';
import { AppliedCandidatesProfilesComponent } from './applied-candidates-profiles/applied-candidates-profiles.component';
import { ViewCandidateProfileComponent } from './view-candidate-profile/view-candidate-profile.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoaderComponent } from './loader/loader.component';
import { MomentPipe } from './pipes/momentPipe';
import * as moment from 'moment';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzBackTopModule } from 'ng-zorro-antd/back-top';
import { NgxDocViewerModule } from 'ngx-doc-viewer'
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {NgxExtendedPdfViewerModule} from 'ngx-extended-pdf-viewer'
// import {AgmCoreModule} from '@agm/core'
import {SafePipeModule } from 'safe-pipe'
import { NzModalModule } from 'ng-zorro-antd/modal';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    RegisterComponent,
    CandidateProfileComponent,
    EmployeeProfileComponent,
    AllJobsComponent,
    CompanyProfileComponent,
    JobDetailsComponent,
    FooterComponent,
    ErrorPageComponent,
    CompanyProfileDetailsComponent,
    AppliedCandidatesProfilesComponent,
    ViewCandidateProfileComponent,
    NavbarComponent,
    LoaderComponent,
    MomentPipe,


  ],
  imports: [
    MDBBootstrapModule.forRoot(),
    ConfirmDialogModule,
    ReactiveFormsModule,
    ToastrModule,
    NzUploadModule,
    SafePipeModule ,
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    NzPopconfirmModule,
    NzBackTopModule,
    MatNativeDateModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    NgxSpinnerModule,
    NzEmptyModule,
    MatBadgeModule,
    NzModalModule,
    FormsModule,
    HttpClientModule,
    MatCardModule,
    MatTableModule,
    MatRadioModule,
    DropdownModule,
    DialogModule,
    MatDialogModule,
    NgxPaginationModule,
    MatDividerModule,
    NgbModule,
    NzSpinModule,
    MatIconModule,

    MatPaginatorModule,
    MatDividerModule,
    MatSnackBarModule,
    ExportAsModule,
    NzToolTipModule,
    NgZorroAntdModule,
    NzDatePickerModule,
    NzTimePickerModule,
    NzButtonModule,
    NzMessageModule,
    NzResultModule,
    NzAvatarModule,
    NzBadgeModule,
    NgxMaterialTimepickerModule,
    NgxDocViewerModule,
    NgxExtendedPdfViewerModule,
    StarRatingModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 1000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true,
      progressAnimation: 'decreasing',
      closeButton: true
    }),
    InfiniteScrollModule
    // MatGridListModule
  ],
  providers: [

    NgxSpinnerService,
    MatDatepickerModule,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NoopInterceptor,
      multi: true
    },
    { provide: NZ_I18N, useValue: en_US },
    ConfirmationService,
    CandidateProfileComponent,
    CompanyProfileComponent

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
