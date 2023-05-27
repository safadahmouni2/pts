import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementUsFeatureComponent } from './management-us-feature.component';

describe('ManagementUsFeatureComponent', () => {
  let component: ManagementUsFeatureComponent;
  let fixture: ComponentFixture<ManagementUsFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagementUsFeatureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagementUsFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
