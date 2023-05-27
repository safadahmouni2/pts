/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';

import {TestcaseFormComponent} from './testcase-form.component';

describe('TestcaseFormComponent', () => {
  let component: TestcaseFormComponent;
  let fixture: ComponentFixture<TestcaseFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestcaseFormComponent],
      imports: [
        RouterTestingModule,
        HttpClientModule
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestcaseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
