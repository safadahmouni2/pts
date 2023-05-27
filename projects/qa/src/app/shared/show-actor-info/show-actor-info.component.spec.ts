import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowActorInfoComponent } from './show-actor-info.component';

describe('ShowActorInfoComponent', () => {
  let component: ShowActorInfoComponent;
  let fixture: ComponentFixture<ShowActorInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowActorInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowActorInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
