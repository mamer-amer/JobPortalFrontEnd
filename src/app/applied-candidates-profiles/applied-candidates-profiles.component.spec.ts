import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppliedCandidatesProfilesComponent } from './applied-candidates-profiles.component';

describe('AppliedCandidatesProfilesComponent', () => {
  let component: AppliedCandidatesProfilesComponent;
  let fixture: ComponentFixture<AppliedCandidatesProfilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppliedCandidatesProfilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppliedCandidatesProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
