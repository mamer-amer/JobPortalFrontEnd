import { Component, OnInit } from '@angular/core';
import * as Mapboxgl from 'mapbox-gl';
import { environment } from '../../environments/environment'
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-employee-alljobs',
  templateUrl: './employee-alljobs.component.html',
  styleUrls: ['./employee-alljobs.component.css']
})
export class EmployeeAlljobsComponent implements OnInit {

   constructor(public service:ApplicantServiceService) { }

  validatingForm: FormGroup;



  ngOnInit() {
    this.validatingForm = new FormGroup({
      modalFormAvatarPassword: new FormControl('', Validators.required)
    });
  }

  get modalFormAvatarPassword() {
    return this.validatingForm.get('modalFormAvatarPassword');
  }
 
}
