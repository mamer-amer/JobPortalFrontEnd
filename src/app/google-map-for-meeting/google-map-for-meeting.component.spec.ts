import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleMapForMeetingComponent } from './google-map-for-meeting.component';

describe('GoogleMapForMeetingComponent', () => {
  let component: GoogleMapForMeetingComponent;
  let fixture: ComponentFixture<GoogleMapForMeetingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoogleMapForMeetingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleMapForMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
