import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css']
})
export class EmployeeProfileComponent implements OnInit {



  fields: any[] = [
    { value: 'businessFinance', viewValue: 'Business & Finance' },
    { value: 'computersTechnology', viewValue: 'Computers & Technology' },
    { value: 'contructionTrades', viewValue: 'Contruction Trades' },
    { value: 'educationTeachingTraining', viewValue: 'Education, Teaching & Training' },
    { value: 'engineeringEngineeringTechnicians', viewValue: 'Engineering & Engineering Technicians' },
    { value: 'fishingFarmingForestry', viewValue: 'Fishing, Farming & Forestry' },
    { value: 'legalCriminalJusticeLawEnforcement', viewValue: 'Legal, Criminal Justice & Law Enforcement' },
    { value: 'management', viewValue: 'Management' },
    { value: 'mediaCommunicationsBroadcasting', viewValue: 'Media Communications & Broadcasting' },
    { value: 'militaryArmedForces', viewValue: 'Military & Armed Forces' },
    { value: 'officeAdministrationManagement', viewValue: 'Office Administration & Management' },
    { value: 'productionManufacturing', viewValue: 'Production & Manufacturing' },
    { value: 'installationRepairMaintenance', viewValue: 'Installation, Repair & Maintenance' },
    { value: 'salesMarketing', viewValue: 'Sales & Marketing' },
    { value: 'socialLifeSciences', viewValue: 'Social & Life Sciences' },
    { value: 'transportationMoving', viewValue: 'Transportation & Moving' },

  ];

  latitude = 38.8951;
  longitude = -77.0364;

  selectedField;
  constructor() { }

  ngOnInit(): void {
  }

  submitJob(myForm): void {
    console.log(myForm)
  }

}
