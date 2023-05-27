import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCaseInfoPanelComponent } from './test-case-info-panel.component';

describe('TestCaseInfoPanelComponent', () => {
  let component: TestCaseInfoPanelComponent;
  let fixture: ComponentFixture<TestCaseInfoPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestCaseInfoPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestCaseInfoPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
