import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyProfileDetailsComponent } from './company-profile-details.component';

describe('CompanyProfileDetailsComponent', () => {
  let component: CompanyProfileDetailsComponent;
  let fixture: ComponentFixture<CompanyProfileDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyProfileDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyProfileDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
