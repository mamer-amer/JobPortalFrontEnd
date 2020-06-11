import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchForCandidatesComponent } from './search-for-candidates.component';

describe('SearchForCandidatesComponent', () => {
  let component: SearchForCandidatesComponent;
  let fixture: ComponentFixture<SearchForCandidatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchForCandidatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchForCandidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
