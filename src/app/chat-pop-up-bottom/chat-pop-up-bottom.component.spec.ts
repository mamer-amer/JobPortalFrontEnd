import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatPopUpBottomComponent } from './chat-pop-up-bottom.component';

describe('ChatPopUpBottomComponent', () => {
  let component: ChatPopUpBottomComponent;
  let fixture: ComponentFixture<ChatPopUpBottomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatPopUpBottomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatPopUpBottomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
