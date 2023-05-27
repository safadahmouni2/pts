/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TestcaseLibraryComponent} from './testcase-library.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('TestcaseLibraryComponent', () => {
  let component: TestcaseLibraryComponent;
  let fixture: ComponentFixture<TestcaseLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TestcaseLibraryComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestcaseLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


});
