import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotpasswordscreenComponent } from './forgotpasswordscreen.component';

describe('ForgotpasswordscreenComponent', () => {
  let component: ForgotpasswordscreenComponent;
  let fixture: ComponentFixture<ForgotpasswordscreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotpasswordscreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotpasswordscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
