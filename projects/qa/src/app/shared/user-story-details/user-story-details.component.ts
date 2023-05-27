import {Component, OnInit, Input, OnDestroy, OnChanges, SimpleChanges} from '@angular/core';
import { UserStoryServices } from '../../services/userStoryServices';
import { UserStory } from '../../models/UserStory';
import {ActivatedRoute, Router} from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { Subscription, Observable, Subject } from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import { UsTestCase } from '../../models/UsTestCase';
import { UsTestCaseServices } from '../../services/usTestCaseServices';
import {Globals} from "../../config/globals";

@Component({
  selector: 'app-user-story-details',
  templateUrl: './user-story-details.component.html',
  styleUrls: ['./user-story-details.component.css']
})
export class UserStoryDetailsComponent implements OnInit, OnDestroy ,OnChanges{
  focusedFIeld = '';

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('with_search') withSearch = false;

  @Input() userStoryId;
  @Input() refreshedTestCase: Observable<any>;

  showUserStoriesList = true;
  userStory: UserStory;
  dataLogged = false;
  testCaseSelected: UsTestCase;
  testCaseClass: number;
  testCaseList: UsTestCase[];
  usIdFromPath: any;
  tcIdFromPath: any;
  clickEventSubscription: Subscription;
  destroy$ = new Subject<void>();
  usId: any;
  @Input() clickEventNextAndPrevious: Subscription;
  usSearchField = '';
  public listUserStory: UserStory[] = [];
  public allUsBySprint: UserStory[] = [];
  showSearchUsDropdown = false;
  inputSearchFocused = false;
  selectedUsId:any;

  constructor(
    private activatedRoute: ActivatedRoute, private userStoryServices: UserStoryServices,
    private usTestCaseServices: UsTestCaseServices, private sharedService: SharedService,
    private globals: Globals,private router:Router) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.userStoryId) {
      this.getUserStoryById();
    }
  }

  ngOnInit(): void {
    this.getUserStoryBySprintId();
    // get param from parent component path
    this.usIdFromPath = this.activatedRoute.snapshot.paramMap.get('userStoryId');
    this.getUserStoryById();
    this.subscribeRefreshTestCases();
    this.clickEventNextAndPrevious = this.sharedService.getClickEvent().subscribe(() => { this.getUserStoryById(); });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all observables and complete destroy subject
    this.destroy$.next();
    this.destroy$.complete();
  }

  public fieldFocus(event, focusedFIeld?): void {
    event.target.parentNode.classList.add('focused');
    if (focusedFIeld) {
      this.focusedFIeld = focusedFIeld;
    }
  }

  public fieldBlur(event): void {
    if (event.target.value === '') {
      event.target.parentNode.classList.remove('focused');
    }
  }

  findUSByDescription(description: string) {
    return this.allUsBySprint.filter(us => description && (us.text.toLowerCase().includes(description.toLowerCase())));
  }

  findUsById(id) {
    return this.allUsBySprint.find(us => id && us.id.toString() === id);
  }

  onChangeSearchUsField(event) {
    let searchById, searchByDescription;
    this.inputSearchFocused = false;
    this.showSearchUsDropdown = true;

    if (event.target.value && event.target.value != '') {
      searchByDescription = this.findUSByDescription(event.target.value);
      searchById = this.findUsById(event.target.value);
      if (searchByDescription) {
        this.listUserStory = searchByDescription;
      } else {
        this.listUserStory = searchById;
      }
      this.userStoryById(this.listUserStory[0]?.id);
    } else {
      this.getUserStoryBySprintId();
      this.usSearchField = '';
    }
  }

  onSelectUs(us, event) {
    if (this.router.url.startsWith('/testcase/')) {
      this.router.navigate(['/testcase', us.id]);
    } else {
      const testCaseId = parseInt(this.activatedRoute.snapshot.paramMap.get('testCaseLibraryId'));
      this.router.navigate(['/edittestcase', us.id, testCaseId]);
    }
    this.usSearchField = us.text;
    event.target.parentNode.parentNode.classList.add('focused');
    this.inputSearchFocused = false;
    this.showSearchUsDropdown = false;
    this.usSearchField='';
  }

  openDropDown() {
    this.inputSearchFocused = true;
  }

  subscribeRefreshTestCases() {
    if (this.refreshedTestCase) {
      this.refreshedTestCase
        .pipe(takeUntil(this.destroy$))
        .subscribe(value => {
          this.loadTestCasesByUserStoryId();
        });
    } else {
      // console.log('no input')
    }
  }

  public getUserStoryById(searchUsValue?): void {
      if (searchUsValue) {
      this.selectedUsId = searchUsValue;
    } else {
      this.selectedUsId = this.userStoryId ? this.userStoryId : this.usIdFromPath;
    }
    if(this.router.url.includes('/testcase/')){
      this.router.navigate(['/testcase', this.selectedUsId]);
    }
    this.userStoryById(this.selectedUsId);
  }

  userStoryById(usId?) {
    this.userStoryServices.getUserStoryById(usId).subscribe(
      (data) => {
        this.userStory = data;
        this.dataLogged = true;
          this.loadTestCasesByUserStoryId();
          this.getTestCaseSelected();

      }
    );
  }
  getTestCaseSelected(): void {
    let path: string;
    // this.activatedRoute.pathFromRoot[1].url.subscribe(val => path = val[0].path);
      if (this.tcIdFromPath) {
        if (Number(this.tcIdFromPath)) {
          this.tcIdFromPath = parseInt(this.tcIdFromPath, 10);
        }

      if (path === 'edittestcase') {
        this.getTCFromPath(this.tcIdFromPath)
      }
    }
  }

  getTCFromPath(tcId) {
    this.usTestCaseServices.getTestCaseById(tcId).subscribe(
      (data) => {
        if (data) {
          this.testCaseSelected = data;
          this.testCaseClass = data.usTestCaseId;
          this.dataLogged = true;
        }
      }
    );
  }
  private loadTestCasesByUserStoryId(): void {
    this.usId = this.userStoryId ? this.userStoryId : this.usIdFromPath;
    this.getTCListByUserStoryId(this.usId);
  }

  getTCListByUserStoryId(usId) {
    if (Number(usId)) {
      this.usTestCaseServices.getTestCaseListByUserStoryId(parseInt(usId, 10)).subscribe(
        (data) => {
          this.testCaseList = data;
        }
      );
    }
  }

  public selectTestCase(testCase: UsTestCase) {
    if (testCase != null) {
      this.testCaseClass = testCase.usTestCaseId;
      this.testCaseSelected = testCase;
      this.router.navigate(['/edittestcase',this.testCaseSelected.userStoryId, this.testCaseSelected.testCaseLibraryId]);
    } else {
      this.testCaseClass = null;
      this.testCaseSelected = null;
    }
  }

  unselectTestCase(id: number): void {
    if (id === this.testCaseSelected.usTestCaseId) {
      this.testCaseSelected = null;
    }
  }

  getUserStoryBySprintId() {
    this.userStoryServices.getUserStoryBySprintId(parseInt(this.globals.getSprintId()))
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        data => {
          this.allUsBySprint = data;
          this.listUserStory=  this.allUsBySprint;
        });
  }

  toggleUserStoriesSearch() {
    this.showSearchUsDropdown = !this.showSearchUsDropdown;
  }
  public toggleUserStoriesList() {
    this.showUserStoriesList = !this.showUserStoriesList;
  }

}
