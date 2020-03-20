import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAlljobsComponent } from './employee-alljobs.component';

describe('EmployeeAlljobsComponent', () => {
  let component: EmployeeAlljobsComponent;
  let fixture: ComponentFixture<EmployeeAlljobsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeAlljobsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeAlljobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
