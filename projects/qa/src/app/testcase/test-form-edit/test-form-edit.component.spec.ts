/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

import { TestFormEditComponent } from './test-form-edit.component';

describe('TestcaseFormComponent', () => {
  let component: TestFormEditComponent;
  let fixture: ComponentFixture<TestFormEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestFormEditComponent],
      imports: [
        RouterTestingModule,
        HttpClientModule
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestFormEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
