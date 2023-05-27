/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { UserStoryItemComponent } from './user-story-item.component';

describe('UserStoryItemComponent', () => {
  let component: UserStoryItemComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserStoryItemComponent,
        TestWrapperComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TestWrapperComponent);
    component = fixture.debugElement.children[0].componentInstance;
    fixture.detectChanges();
  }));


  @Component({
    selector: 'app-test-component-wrapper',
    template: '<app-user-story-item [userStory]="userStory"></app-user-story-item>'
  })
  class TestWrapperComponent {

  }

  it(
    'should create', () => {
      expect(component).toBeTruthy();
    });

  it('should display the user story id', () => {
    const debugElement = fixture.debugElement.query(By.css('h3'));
    const htmlElement = debugElement.nativeElement;
    expect(htmlElement.textContent).toEqual('U: 15264850');
  });

  it('should display the user story name and user story description', () => {
    const debugElement = fixture.debugElement.queryAll(By.css('div'));
    const htmlElement = debugElement[1].nativeElement;
    expect(htmlElement.textContent).toEqual('Create test case: As a tester, I need to create a test case');

  });

  it('should display the user story state is IN_DEV', () => {
    const debugElement = fixture.debugElement.queryAll(By.css('span'));
    const htmlElement = debugElement[0].nativeElement;
    expect(htmlElement.textContent).toEqual('IN_DEV');

  });

});
