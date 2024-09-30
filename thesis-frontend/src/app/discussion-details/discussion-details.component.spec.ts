import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscussionDetailsComponent } from './discussion-details.component';

describe('DiscussionDetailsComponent', () => {
  let component: DiscussionDetailsComponent;
  let fixture: ComponentFixture<DiscussionDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiscussionDetailsComponent]
    });
    fixture = TestBed.createComponent(DiscussionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
