import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenderPublicComponent } from './tender-public.component';

describe('TenderPublicComponent', () => {
  let component: TenderPublicComponent;
  let fixture: ComponentFixture<TenderPublicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenderPublicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenderPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
