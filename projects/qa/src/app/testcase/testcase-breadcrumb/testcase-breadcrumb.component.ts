import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TestCaseLibrary } from '../../models/test-case-library';
import { TestCaseLibrarySearchInput } from '../../models/TestCaseLibrarySearchInput';
import { TestCaseLibraryService } from '../../services/test-case-library.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-testcase-breadcrumb',
  templateUrl: './testcase-breadcrumb.component.html',
  styleUrls: ['./testcase-breadcrumb.component.css']
})
export class TestcaseBreadcrumbComponent implements OnDestroy, OnChanges{
  focusedFIeld = '';
  searchValue: string;
  searching = false;
  selectedFolderId: number;
  selectedProductId: number;
  testCaseList: TestCaseLibrary[];
  @Output() searchResult = new EventEmitter();
  @Output() ShowSearchResult = new EventEmitter();
  @Input() selectedFolderOrProduct: any;
  @Input() testCaseSelected: any;
  @Input() refreshedTestCase: Observable<any>;
  @Input() product: Observable<any>;
  @Output() selectedNameFromBreadcrumb = new EventEmitter();
  destroy$ = new Subject<void>();
  hasSearchResult = false;
  isTestCaseSelected = false;
  testCase
  folderPath: any;
  hasTestCase: any;
  shortDescription: any


  constructor(private testCaseLibraryService: TestCaseLibraryService, private cdRef: ChangeDetectorRef,private router: Router,

  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    // Handle changes to the selected folder or product
    const selected = changes.selectedFolderOrProduct ?.currentValue;
    const folderPathFromSearch = changes.testCaseSelected?.currentValue;
    const refreshedTestCase = changes.refreshedTestCase?.currentValue;
    this.folderPath = [];
    if (selected) {
      // Extract the relevant properties from the selected object
      const { testCase, folderData, product } = selected;
      // Update the selected folder ID and product ID based on the node type
      switch (selected.nodeType) {
        case 'TEST_CASE': {
          this.hasTestCase = true;
          this.selectedFolderId = testCase.folder.folderId;
          this.selectedProductId = testCase.productId;
          this.isTestCaseSelected = true;
          this.hasSearchResult = false;
          this.folderPath = testCase.folder.folderPath.split('/');
          this.folderPath[0] = selected.parent.product.product_name;
          this.shortDescription = selected.label;          ;

          break;
        }
        case 'FOLDER': {
          this.selectedFolderId = folderData.folderId;
          this.selectedProductId = product.product_id;
          this.searchResult.emit([]);
          this.hasTestCase = false;
          this.isTestCaseSelected = false;
          this.hasSearchResult = false;
          this.folderPath = selected.folderData.folderPath.split('/');
          this.folderPath[0] = selected.product.product_name;

          break;
        }
        case 'PRODUCT': {
          this.selectedFolderId = null;
          this.selectedProductId = product.product_id;
          this.folderPath.push(product.label);
          this.searchResult.emit([]);
          this.isTestCaseSelected = false;
          this.hasTestCase = false;
          this.hasSearchResult = false;
          this.folderPath[0] = selected.product.product_name
          break;
        }
      }

    }
    if (folderPathFromSearch  && !changes.selectedFolderOrProduct) {
      this.hasTestCase =true;
      this.folderPath = folderPathFromSearch.folder.folderPath.split('/');
      this.folderPath[0] = folderPathFromSearch.product_name;
      this.shortDescription = folderPathFromSearch.shortDescription;

    } 
    if(refreshedTestCase){
      this.hasTestCase =true;
      this.folderPath = refreshedTestCase.folder.folderPath.split('/');
      this.folderPath[0] = refreshedTestCase.product_name;
      this.shortDescription = refreshedTestCase.shortDescription;
    }
    this.cdRef.detectChanges();    
  }

  ngOnDestroy(): void {
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
    this.focusedFIeld = '';
  }

  public searchInLibrary() {
    this.isTestCaseSelected = false;
    const searchInput = new TestCaseLibrarySearchInput();
    this.selectedFolderId != null ? searchInput.folderId = this.selectedFolderId : undefined;
    searchInput.productId = this.selectedProductId;
    if (this.searchValue != undefined && this.searchValue != "") {
      const onlyNumbers = /^[0-9]+$/.test(this.searchValue);
      if (onlyNumbers) {
        searchInput.testCaseLibraryId = this.searchValue;
      } else {
        searchInput.shortDescription = this.searchValue;
      }
      this.testCaseLibraryService.searchForTestCase(searchInput).pipe(takeUntil(this.destroy$)).subscribe(
        searchResult => {
          this.searchResult.emit(searchResult);
          this.hasSearchResult = true;
        }
      );
    }
  }

  public goBackToSearchResult() {
    this.isTestCaseSelected = false;
    this.ShowSearchResult.emit(true);
  }

  getSelectedName(selectedName, type) {
    let folderSelectedPath = [];    
    if (type === 'FOLDER') {
      this.hasTestCase = false;

      for (let folderName of this.folderPath) {
        folderSelectedPath.push(folderName);
        this.folderPath = folderSelectedPath;
        if (folderName === selectedName)
          break;
      }
    } else {
      this.hasTestCase = true;
      this.isTestCaseSelected =true;
       folderSelectedPath = this.folderPath;
    }
    this.cdRef.detectChanges()    
    this.selectedNameFromBreadcrumb.emit(folderSelectedPath);
  }
}
