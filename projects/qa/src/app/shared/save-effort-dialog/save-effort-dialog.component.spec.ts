import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveEffortDialogComponent } from './save-effort-dialog.component';

describe('SaveEffortDialogComponent', () => {
  let component: SaveEffortDialogComponent;
  let fixture: ComponentFixture<SaveEffortDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveEffortDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveEffortDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
