import { Component, OnInit, ViewChild } from '@angular/core';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-all-jobs',
  templateUrl: './all-jobs.component.html',
  styleUrls: ['./all-jobs.component.css']
})
export class AllJobsComponent implements OnInit {

  /** Constants used to fill up our data base. */
  displayedColumns: string[] = ['title', 'field', 'description', 'salary', 'datePosted','action'];
  dataSource: MatTableDataSource<any>;
  tableData: any[] = [];
  selectedfield:any;

  message = false;
  @ViewChild('scheduledOrdersPaginator') paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;


  fields: any[] = [
    { value: 'all', viewValue: 'Show All jobs' },
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



  constructor(private _location: Location, private service: ApplicantServiceService, private router: Router, private activateRoute: ActivatedRoute) {



  }

  ngOnInit(): void {

    this.showAllJobs();
  }






  logout() {
    sessionStorage.clear();
    this.router.navigateByUrl('');
  }

  goBack() {
    this._location.back();
  }


  showAllJobs() {
    this.service.getAllJobs().subscribe(res => {
      console.log(res);
      
      res.map(d=>{
        this.tableData.push({
          title: d.title,
          field: d.field,
          description: d.description,
          salary: d.salary,
          datePosted: d.datePosted
        })
      })
 
      console.log(this.tableData)
      this.dataSource = new MatTableDataSource(this.tableData);
      this.dataSource.paginator = this.paginator;
    })
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  searchWithField(){
    if (this.selectedfield!=null){
      this.service.searchJobWithRespectToField(this.selectedfield).subscribe(res=>{

          if(res){
            this.message = false;
            this.tableData = [];
            this.dataSource = null;
            res.map(d => {
              this.tableData.push({
                title: d.title,
                field: d.field,
                description: d.description,
                salary: d.salary,
                datePosted: d.datePosted
              })
            });
            this.dataSource = new MatTableDataSource(this.tableData);
            this.dataSource.paginator = this.paginator;

          }
          else{
                 
              this.message = true;
            
          }
          
            
        })
    }
  }
}




