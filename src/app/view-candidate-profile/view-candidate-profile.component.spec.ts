import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCandidateProfileComponent } from './view-candidate-profile.component';

describe('ViewCandidateProfileComponent', () => {
  let component: ViewCandidateProfileComponent;
  let fixture: ComponentFixture<ViewCandidateProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCandidateProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCandidateProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
