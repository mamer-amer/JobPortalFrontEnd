import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetpasswordscreenComponent } from './resetpasswordscreen.component';

describe('ResetpasswordscreenComponent', () => {
  let component: ResetpasswordscreenComponent;
  let fixture: ComponentFixture<ResetpasswordscreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetpasswordscreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetpasswordscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
