import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketSearchComponent } from './ticket-search.component';

describe('TicketSearchComponent', () => {
  let component: TicketSearchComponent;
  let fixture: ComponentFixture<TicketSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TicketSearchComponent]
    });
    fixture = TestBed.createComponent(TicketSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
