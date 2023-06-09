import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BarsComponent } from './bars.component';

describe('BarsComponent', () => {
  let component: BarsComponent;
  let fixture: ComponentFixture<BarsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BarsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
