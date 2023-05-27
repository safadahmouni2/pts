import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MypropositionComponent } from './myproposition.component';

describe('MypropositionComponent', () => {
  let component: MypropositionComponent;
  let fixture: ComponentFixture<MypropositionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MypropositionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MypropositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
