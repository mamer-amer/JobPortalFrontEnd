import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavbarService } from '../navbar.service';

@Component({
  selector: 'app-cv-builder',
  templateUrl: './cv-builder.component.html',
  styleUrls: ['./cv-builder.component.css']
})
export class CvBuilderComponent implements OnInit {

  // isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  constructor(private navbar: NavbarService,private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.navbar.showNav();
   
  }

}
