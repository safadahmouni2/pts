
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { TestCaseItemComponent } from './test-case-item.component';
import { TestCase } from '../../models/TestCase';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TestCaseItemComponent', () => {
  let component: TestCaseItemComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TestCaseItemComponent,
        TestWrapperComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWrapperComponent);
    component = fixture.debugElement.children[0].componentInstance;
    fixture.detectChanges();
  });

  @Component({
    selector: 'app-test-component-wrapper',
    template: '<app-test-case-item [testCase]="testCase" [isTestCaseView]="true"></app-test-case-item>'
  })
  class TestWrapperComponent {
    testCase: TestCase = {
      testCaseId: 12457861,
      shortDescription: 'test of the bottun delete',
      description: 'test the functionality of the button delete a test case',
      category: 'Design',
      state: 'TO_BE_APPROVED',
      preCondition: 'user logged',
      effort: 2,
      executionEstimationTime: 2,
      userStoryId: 15264850,
      testSteps: []
    };
  }


  it(
    'should create', () => {
      expect(component).toBeTruthy();
    });

  it('should display the test case id', () => {
    const debugElement = fixture.debugElement.query(By.css('h3'));
    const htmlElement = debugElement.nativeElement;
    expect(htmlElement.textContent).toEqual('TC-12457861');
  });

  it('should display the test case name and test case description', () => {
    const debugElement = fixture.debugElement.queryAll(By.css('p'));
    const htmlElement = debugElement[0].nativeElement;
    expect(htmlElement.textContent).toEqual('test of the bottun delete test the functionality of the button delete a test case');

  });

  it('should display the user story id of test case when isTestCaseView ', () => {
    const debugElement = fixture.debugElement.queryAll(By.css('span'));
    const htmlElement = debugElement[0].nativeElement;
    expect(htmlElement.textContent).toEqual('U: 15264850');

  });


  it('should display the test case state ', () => {
    const debugElement = fixture.debugElement.queryAll(By.css('span'));
    const htmlElement = debugElement[1].nativeElement;
    expect(htmlElement.textContent).toEqual('TO_BE_APPROVED');

  });
});
