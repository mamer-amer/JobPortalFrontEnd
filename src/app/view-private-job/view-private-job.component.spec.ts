import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPrivateJobComponent } from './view-private-job.component';

describe('ViewPrivateJobComponent', () => {
  let component: ViewPrivateJobComponent;
  let fixture: ComponentFixture<ViewPrivateJobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPrivateJobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPrivateJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
