import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManagementQmComponent } from './management-qm.component';

describe('ManagementQmComponent', () => {
  let component: ManagementQmComponent;
  let fixture: ComponentFixture<ManagementQmComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementQmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementQmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
