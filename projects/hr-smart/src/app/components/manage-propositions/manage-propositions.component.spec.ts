import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManagePropositionsComponent } from './manage-propositions.component';

describe('ManagePropositionsComponent', () => {
  let component: ManagePropositionsComponent;
  let fixture: ComponentFixture<ManagePropositionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagePropositionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePropositionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
