import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {ProcessDetailComponent} from './process-detail.component';

describe('ProcessDetailComponent', () => {
  let component: ProcessDetailComponent;
  let fixture: ComponentFixture<ProcessDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProcessDetailComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
