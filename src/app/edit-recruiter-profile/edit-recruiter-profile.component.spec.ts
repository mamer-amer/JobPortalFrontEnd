import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRecruiterProfileComponent } from './edit-recruiter-profile.component';

describe('EditRecruiterProfileComponent', () => {
  let component: EditRecruiterProfileComponent;
  let fixture: ComponentFixture<EditRecruiterProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditRecruiterProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRecruiterProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
