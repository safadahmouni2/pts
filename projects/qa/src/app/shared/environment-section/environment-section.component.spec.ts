
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvironmentSectionComponent } from './environment-section.component';

describe('EnvironmentSectionComponent', () => {
  let component: EnvironmentSectionComponent;
  let fixture: ComponentFixture<EnvironmentSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EnvironmentSectionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvironmentSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
