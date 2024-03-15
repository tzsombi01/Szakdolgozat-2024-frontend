import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoAccessPageComponent } from './no-access-page.component';

describe('NoAccessPageComponent', () => {
  let component: NoAccessPageComponent;
  let fixture: ComponentFixture<NoAccessPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoAccessPageComponent]
    });
    fixture = TestBed.createComponent(NoAccessPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
