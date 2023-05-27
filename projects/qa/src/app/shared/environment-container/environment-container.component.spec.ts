
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvironmentContainerComponent } from './environment-container.component';

describe('EnvironmentContainerComponent', () => {
  let component: EnvironmentContainerComponent;
  let fixture: ComponentFixture<EnvironmentContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EnvironmentContainerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvironmentContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
