import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentationDetailsComponent } from './documentation-details.component';

describe('DocumentationDetailsComponent', () => {
  let component: DocumentationDetailsComponent;
  let fixture: ComponentFixture<DocumentationDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentationDetailsComponent]
    });
    fixture = TestBed.createComponent(DocumentationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
