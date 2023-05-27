import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UsDetailComponent } from './us-detail.component';

describe('UsDetailComponent', () => {
  let component: UsDetailComponent;
  let fixture: ComponentFixture<UsDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
