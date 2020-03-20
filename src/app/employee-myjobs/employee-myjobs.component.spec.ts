import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeMyjobsComponent } from './employee-myjobs.component';

describe('EmployeeMyjobsComponent', () => {
  let component: EmployeeMyjobsComponent;
  let fixture: ComponentFixture<EmployeeMyjobsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeMyjobsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeMyjobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
