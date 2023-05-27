import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTestRunComponent } from './create-test-run.component';

describe('CreateTestRunComponent', () => {
  let component: CreateTestRunComponent;
  let fixture: ComponentFixture<CreateTestRunComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateTestRunComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTestRunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
