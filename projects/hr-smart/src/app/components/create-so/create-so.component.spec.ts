import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateSOComponent } from './create-so.component';

describe('CreateSOComponent', () => {
  let component: CreateSOComponent;
  let fixture: ComponentFixture<CreateSOComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSOComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
