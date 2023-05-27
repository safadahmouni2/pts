import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PropositionsComponent } from './propositions.component';

describe('PropositionsComponent', () => {
  let component: PropositionsComponent;
  let fixture: ComponentFixture<PropositionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PropositionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropositionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
