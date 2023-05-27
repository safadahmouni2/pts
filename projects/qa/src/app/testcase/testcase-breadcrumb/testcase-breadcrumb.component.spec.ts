import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryBreadcrumbComponent } from './library-breadcrumb.component';

describe('LibraryBreadcrumbComponent', () => {
  let component: LibraryBreadcrumbComponent;
  let fixture: ComponentFixture<LibraryBreadcrumbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LibraryBreadcrumbComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
