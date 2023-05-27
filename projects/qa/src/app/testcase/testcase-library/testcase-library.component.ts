import { Component, EventEmitter, Input, OnInit, Output, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../../models/Product';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { FoldersService } from '../../services/foldersServices';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Folder } from '../../models/Folder';
import { ActivatedRoute, Router } from '@angular/router';
import { UserStory } from '../../models/UserStory';
import { TestCaseLibrary } from '../../models/test-case-library';
import { TestCaseLibraryService } from '../../services/test-case-library.service';
import { UserStoryServices } from '../../services/userStoryServices';
import { Globals } from '../../config/globals';
import { UsTestCase } from '../../models/UsTestCase';
import { UserService } from '../../services/userService';
import { ProductsServices } from '../../services/productsServices';
import * as FileSaver from 'file-saver';
import { TreeNode, MenuItem, TreeDragDropService } from 'primeng/api';
import { SourceSystem } from "../../models/SourceSystem";

import { ConfirmationDialogService } from '../../services/confirmation-dialog.service';

@Component({
  selector: 'app-testcase-library',
  templateUrl: './testcase-library.component.html',
  styleUrls: ['./testcase-library.component.css'],
  providers: [TreeDragDropService],


})
export class TestcaseLibraryComponent implements OnInit, OnChanges, OnDestroy {
  @Input() userStoryId: any;
  @Input() refreshedTestCase: any;
  @Output() sendRequestToParent = new EventEmitter();
  @Output() openFolderWhenTestCaseAdded = new EventEmitter();
  createdTC: Subject<any> = new Subject<any>();
  @Input() openFolderTC = new EventEmitter();
  @Input() currentProductID: number;
  @Input() currentFolderId: number;
  @Input() testCaseSelected: TestCaseLibrary;

  @Output() resetProductIdAndFolderId = new EventEmitter();
  @Output() selectedLibraryObject = new EventEmitter();

  @ViewChild('mymodal') myModel: ElementRef;
  @Output() sendSelectedFolderForImport = new EventEmitter();
  @Output() initNode = new EventEmitter();

  @Input() selectedNameFromBreadcrumb: any=[];

  hasTestCase = false;
  showTc = true;
  folderIds: any;
  status: any
  previousSelectedNode: any;
  testCase: UsTestCase = new UsTestCase();
  testCaseLibrary: TestCaseLibrary = new TestCaseLibrary();
  productList: any = [];
  destroy$ = new Subject<void>();
  foldersByParentId = [];
  testCasesByFolderId = [];
  selectedProduct = null;
  selectedFolder = null;
  closeResult: string;
  testCaseClass: number;
  testCaseLibrarySelected: TestCaseLibrary;
  dataLogged = false;
  folderName: '';
  folder;
  idCreatedTestCase: number;
  currentProductId: number;
  userStory: UserStory;
  user: any;
  public currentFolder = new Folder();
  public folders = [];
  public allFolderAndOpenedSubFolder: any[] = [];
  private folderToEXPORT: Folder;
  private productToEXPORT: Product;
  private parentFolderOrProduct: any;
  private productNameForExport: any;
  private selectedFile: File;
  showLibraryTree = true;
  @Output() showLibraryTreeChange = new EventEmitter<boolean>();
  tree: any[] = [];
  selectedNode: any;
  items: MenuItem[];
  prevSelectedNode: any
  showLibraryComponent = false;

  constructor(
    private testCaseLibraryService: TestCaseLibraryService,
    private toastr: ToastrService,
    private productsServices: ProductsServices,
    public foldersService: FoldersService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userStoryServices: UserStoryServices,
    public globals: Globals,
    private userService: UserService,
    private cdRef: ChangeDetectorRef,
    private treeDragDropService: TreeDragDropService,
    private confirmationDialogService: ConfirmationDialogService,

  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ( changes && !changes.selectedNameFromBreadcrumb && !changes.refreshedTestCase && changes.testCaseSelected && changes.testCaseSelected.currentValue ) {
      this.hasTestCase = true;
      this.updateTree(this.tree, this.testCaseSelected,null,false);
    }
    if (!changes.testCaseSelected && !changes.selectedNameFromBreadcrumb && changes.refreshedTestCase ) {
      this.getChildren(this.selectedNode.parent, false,false);
      this.selectedNode.label=this.refreshedTestCase.shortDescription;
      this.selectedLibraryObject.emit(this.selectedNode);

    } 
    if (!changes.testCaseSelected && !changes.refreshedTestCase &&this.selectedNameFromBreadcrumb !== undefined){
      this.updateTree(this.tree, null,this.selectedNameFromBreadcrumb,true);
    }
  }

  ngOnInit() {
    this.showTc = false;
    this.showLibraryComponent = true;
    this.getProductList();
  }

  getProductList(): void {
    this.productsServices.getAllProductsByUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        data => {

          this.productList = data.reduce((acc, element) => {
            if (element.product_id.toString() === this.globals.getProductId()) {
              return [element, ...acc];
            }
            return [...acc, element];
          }, []);

          // init contextMenuOpened
          this.productList.forEach(item => {

            const data = {
              label: item.product_name,
              data: item.product_name,
              leaf: false,
              nodeType: 'PRODUCT',
              product: item,
              parent: null,
              expanded: false,
              draggable: false,
              children: [],
            }
            if (item.product_id.toString() === this.globals.getProductId() && !this.hasTestCase) {
              this.selecteNode(data);
            }
            this.tree.push(data);
            item.contextMenuOpened = false;
          });
          if (this.testCaseSelected) {
            this.updateTree(this.tree, this.testCaseSelected,null,false);
          }
          // check if productId exist then open product folder
          if (this.currentProductID) {
            this.getFoldersByParentId(this.currentProductID);
          }
          this.spinner.hide();
        }
      );
  }

  public open(content, productId?, folder?, status?) {
    this.status = status;
    this.currentProductId = productId;
    this.currentFolder = folder;
    this.folderName = ""
    if (status === 'EDIT_MODE') {
      this.folderName = folder.name;
    }
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {

      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {

      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

    });

  }


  /**
   * create TestCaseLibrary : add new test case in the testCaseLibrary table
   */
  public createTestCase(usId: number, folder): void {
    // show spinner
    this.spinner.show();
    // add new test case
    this.testCase.userStoryId = usId;
    this.testCaseLibrary.shortDescription = 'New Test Case, Should Be Edited !';
    this.testCaseLibrary.folder = folder;
    this.testCaseLibrary.productId = folder.parentId;
    // this.testCaseLibrary.productId = parseInt(this.globals.getProductId());
    this.addTestCaseLibrary(this.testCaseLibrary, false);

  }

  addTestCaseLibrary(testCase: TestCaseLibrary, isCopyOfTc): void {
    this.spinner.show();
    const sourceSystem = new SourceSystem();
    sourceSystem.sourceSystemName = "PTS_QA";
    testCase.sourceSystem = sourceSystem;
    this.testCaseLibraryService.addTestCaseLibrary(testCase)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        async data => {
          this.toastr.success('Test case created successfully');
          this.sendRequestToParent.emit(false);
          // open folder where test case created
          this.openFolderWhenTestCaseAdded.emit(testCase);
          // action edit
          let path: string;
          if (data) {
            if (Number(data)) {
              this.idCreatedTestCase = parseInt(data, 10);
            }
          }
          testCase.testCaseLibraryId = this.idCreatedTestCase;
          // call goToEditTestCaseLibraryView method to redirect to the test case edit view
          this.goToTestCaseEditView(this.testCase.userStoryId, this.idCreatedTestCase);

          this.activatedRoute.pathFromRoot[1].url.subscribe(val => path = val[0].path);
          const nodeTestCase = {
            label: testCase.shortDescription,
            data: testCase.shortDescription,
            folder: testCase.folder,
            testCase: testCase,
            nodeType: 'TEST_CASE',
            leaf: true,
            draggable: true,
            droppable: false,
            expanded: false,
            children: [],
            product: this.selectedNode.product,
            parent: null
          }
          this.selectedNode.expanded = true;
          if (isCopyOfTc) {
            nodeTestCase.parent= this.selectedNode.parent;
            await this.getChildren(this.selectedNode.parent, false,false);
          } else {
            nodeTestCase.parent= this.selectedNode;
            await this.getChildren(this.selectedNode, false,false);
          }
          this.selectedNode = nodeTestCase;
          this.selectedLibraryObject.emit(this.selectedNode);
          this.spinner.show();
          this.activatedRoute.params.pipe(takeUntil(this.destroy$)).subscribe(
            (params) => {
              this.testCaseLibraryService.getTestCaseLibraryById(this.idCreatedTestCase)
                .pipe(takeUntil(this.destroy$))
                .subscribe((dataEdit) => {
                  this.testCaseLibrarySelected = dataEdit;
                  this.testCaseClass = dataEdit.testCaseLibraryId;
                  this.dataLogged = true;
                  this.spinner.hide();

                }
                );
            }
          );
          // end action edit
          this.spinner.hide();
        }
      );

  }

  public duplicateTestCase(usId: number, testCase, folder, isCopyOfTc): void {
    this.spinner.show();
    this.testCase.userStoryId = usId;
    const testCaseLibrary = new TestCaseLibrary();
    testCaseLibrary.shortDescription = 'copy-' + testCase.shortDescription;
    testCaseLibrary.category = testCase.category;
    testCaseLibrary.preCondition = testCase.preCondition;
    testCaseLibrary.executionEstimationTime = testCase.executionEstimationTime;
    testCaseLibrary.testStepsLibrary = testCase.testStepsLibrary;
    testCaseLibrary.productId = folder.parentId;
    //testCaseLibrary.productId = parseInt(this.globals.getProductId());
    testCaseLibrary.folder = folder;
    this.addTestCaseLibrary(testCaseLibrary, isCopyOfTc);
  }

  public openTestCaseLibraryInEditView(testCase: any) {
    let importObject = {};
    importObject["showTc"] = true;
    this.sendSelectedFolderForImport.emit(importObject);
    this.router.navigate(['/edittestcase', this.userStoryId, testCase.testCaseLibraryId]);
  }

  /**
   * goToTestCaseEditView : to navigate to the edit case view component with two parameters(US_Id and TC_ID)
   * @param userStoryIdEditV : id of the user story
   * @param testCaseIdEditV : id of the test case
   */
  goToTestCaseEditView(userStoryIdEditV: number, testCaseIdEditV: number) {
    this.showLibraryComponent = true;
    // navigate to test case edit view
    this.router.navigate(['/edittestcase', userStoryIdEditV, testCaseIdEditV]);
    // send event to parent to open the library (library stay opened when new test case added in)
    this.sendRequestToParent.emit('openLibrary');
  }

  public toggleLibraryTree() {
    this.showLibraryTree = !this.showLibraryTree;
    this.showLibraryTreeChange.emit(this.showLibraryTree)
  }

  /**
   * Load folders of clicked product
   */
  public getFoldersByParentId(productId: number) {
    this.currentProductID = productId;
    // Get clicked folder index
    const productIndex = this.productList.findIndex(product => product.product_id === productId);
    this.currentProductId = productId;
    if (productIndex === -1) {
      return;
    }
    // Set isOpened property
    this.productList[productIndex].isOpened =
      ('isOpened' in this.productList[productIndex]) ? !this.productList[productIndex].isOpened : true;


    // Collapse other products
    // this.productList.forEach((item, index) => {
    //   item['isOpened'] = index === productIndex ? item['isOpened'] : false;
    // });

    // Load folders
    if (this.productList[productIndex].isOpened) {
      this.spinner.show();
      this.foldersService.getFoldersByParentId(productId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
          this.productList[productIndex].folders = data;
          // Init contextMenuOpened
          this.productList[productIndex].folders.forEach(item => {
            item.contextMenuOpened = false;
          });
          this.spinner.hide();
        });
    }
  }

  private getProductIndex(parentId) {
    const productIndex = this.productList.findIndex(product => product.product_id === parentId);
    if (productIndex === -1 || !this.productList[productIndex].folders) {
      return;
    }
    return productIndex;
  }

  /**
   * getTestCasesAndFoldersByFolderId : retrieve Test cases and sub folders by folder id
   * @param folder folder contain test cases and Sub folders
   */
  public getTestCasesAndFoldersByFolderId(selectedFolder, productId: number) {
    // Set isOpened property
    selectedFolder.isOpened =
      ('isOpened' in selectedFolder) ? !selectedFolder.isOpened : true;
    // this.currentFolder.parentFolderRefId = selectedFolder.folderId;
    // this.currentFolder.parentId = productId;
    // Load test cases
    this.loadTestCases(selectedFolder);
  }

  // Load test case and sub folders of product in folder and sub folder
  public loadTestCases(selectedFolder) {
    this.currentFolder = selectedFolder;
    if (selectedFolder.isOpened) {
      this.spinner.show();
      this.testCaseLibraryService.getTestCasesLibraryByFolderId(selectedFolder.folderId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(testCasesLibraryList => {
          selectedFolder.testCases = testCasesLibraryList.map(tc => ({ testCaseValue: tc, contextMenuOpened: false }));
        });
      this.foldersService.getSubFoldersByFolderRefId(selectedFolder.folderId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
          selectedFolder.subFolders = data;
          selectedFolder.subFolders.forEach(item => {
            item.contextMenuOpened = false;
          });
        });
      this.spinner.hide();
    }

  }

  public getFolderTestCases(folderId) {
    return this.testCasesByFolderId.filter(item => item.folderId === folderId);
  }

  public addFolder() {

    const folder = new Folder();
    folder.name = this.folderName;
    folder.parentId = this.currentProductId;
    if (this.status === 'EDIT_MODE') {
      this.foldersService.renameFolder(this.selectedNode.folderData.folderId, this.folderName).subscribe(data => {
        this.selectedNode.label = this.folderName
        this.selectedNode.folderData.name = this.folderName;
      })
    }
    else {
      if (this.selectedNode.nodeType === 'FOLDER') {
        folder.parentFolderRefId = this.selectedNode.folderData.folderId;
      }
      this.foldersService.addFolder(folder)
        .pipe(takeUntil(this.destroy$)).subscribe(
          data => {
            if (this.status == 'EDIT_MODE') {
              this.selectedNode.label = data.name;
            } else {
              this.selectedNode.children.push(
                {
                  label: this.folderName,
                  data: this.folderName,
                  leaf: false,
                  level: 1,
                  folderData: data,
                  draggable: true,
                  droppable: true,
                  expanded: false,
                  product: this.selectedNode.product,
                  children: []
                });
              this.selectedNode.expanded = true;
              this.getChildren(this.selectedNode, false,false);

            }
            this.toastr.success('Folder created successfully')
          }
        );
    }
  }

  private getDismissReason(reason: any): string {

    if (reason === ModalDismissReasons.ESC) {

      return 'by pressing ESC';

    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {

      return 'by clicking on a backdrop';

    } else {

      return `with: ${reason}`;

    }

  }

  openProductContextMenu(productId: number, event) {
    event.preventDefault();
    const productIndex = this.productList.findIndex(product => product.product_id === productId);
    if (productIndex !== -1) {
      this.selectedProduct = this.productList[productIndex];
      this.productList[productIndex].contextMenuOpened = true;
    }
  }

  closeProductContextMenu(productId: number) {
    const productIndex = this.productList.findIndex(product => product.product_id === productId);

    if (productIndex !== -1) {
      this.productList[productIndex].contextMenuOpened = false;
    }
  }

  openFolderContextMenu(folder, productId: number, event) {
    event.preventDefault();

    // Get product index
    const productIndex = this.productList.findIndex(product => product.product_id === productId);
    if (productIndex === -1 || !this.productList[productIndex].folders || !this.allFolderAndOpenedSubFolder) {
      return;
    }
    // Get clicked folder index
    if (folder) {
      folder.contextMenuOpened = true;
    }
    this.currentFolder = folder;

  }

  closeFolderContextMenu(folder, productId: number) {
    const productIndex = this.productList.findIndex(product => product.product_id === productId);

    if (productIndex === -1) {
      return;
    }

    if (productIndex !== -1) {
      folder.contextMenuOpened = false;
    }

  }
  openTestCaseContextMenu(folder, testCase, event) {
    event.preventDefault();
    if (folder) {
      testCase.contextMenuOpened = true;
    }
    this.currentFolder = folder;
  }

  closeTestCaseContextMenu(selectedTestCase): void {
    if (!this.currentFolder ?.testCases) {
      return;
    }
    const testCaseIndex = this.currentFolder.testCases.findIndex(testCase => testCase.testCaseValue.testCaseLibraryId === selectedTestCase.testCaseValue.testCaseLibraryId);
    if (testCaseIndex !== -1) {
      this.currentFolder.testCases[testCaseIndex].contextMenuOpened = false;
    }
  }

  getSysDate() {
    const date = new Date();
    const dateStr =
      ("00" + (date.getMonth() + 1)).slice(-2) + "-" +
      ("00" + date.getDate()).slice(-2) + "-" +
      date.getFullYear() + " " +
      ("00" + date.getHours()).slice(-2) + "-" +
      ("00" + date.getMinutes()).slice(-2) + "-" +
      ("00" + date.getSeconds()).slice(-2);
    return dateStr;
  }

  public getProductNameByID(productId) {
    const product = this.productList.find(item => item.product_id === productId);
    return product.product_name;
  }
  public exportTcOfSelectedFolder(selected: any) {

    if ('folderId' in selected) {
      this.spinner.show();
      this.folderToEXPORT = selected;
      this.parentFolderOrProduct = this.folderToEXPORT.folderId;
      this.productNameForExport = this.getProductNameByID(this.folderToEXPORT.parentId)
      const fileName = `EXPORT_TC_FOLDER_${this.folderToEXPORT.name}_${this.getSysDate()}.xls`;

      this.testCaseLibraryService.exportFolderTestCasesLibrary(this.parentFolderOrProduct, this.folderToEXPORT.name)
        .pipe(finalize(() => this.spinner.hide()), takeUntil(this.destroy$))
        .subscribe((response) => {
          FileSaver.saveAs(response, fileName);
          this.toastr.success('Export Test cases created successfully');
        }, () => {
          this.toastr.error('Error downloading the Excel file');
        });
    } else {
      if ('product_id' in selected) {
        this.spinner.show();
        this.productToEXPORT = selected;
        this.parentFolderOrProduct = this.productToEXPORT.product_id;
        this.productNameForExport = this.getProductNameByID(this.productToEXPORT.product_id);
        const fileName = `EXPORT_TC_PRODUCT_${this.productNameForExport}_${this.getSysDate()}.xls`;

        this.testCaseLibraryService.exportProductTestCasesLibrary(this.parentFolderOrProduct)
          .pipe(finalize(() => this.spinner.hide()), takeUntil(this.destroy$))
          .subscribe((response) => {
            FileSaver.saveAs(response, fileName);
            this.toastr.success('Export Test cases created successfully');
          }, () => {
            this.toastr.error('Error downloading the Excel file');
          });
      }

    }
  }


  public importTcOfSelectedFolder(selected) {
    this.showLibraryComponent = false;
    if (selected) {
      const importObject = {};

      if (selected && selected.product_id) {
        importObject["productId"] = selected.product_id;
        importObject["productName"] = selected.product_name;
      } else {
        importObject["folderId"] = selected.folderId;
        importObject["folderName"] = selected.name;
        importObject["productId"] = selected.parentId;
      }
      importObject["showTc"] = false;
      this.sendSelectedFolderForImport.emit(importObject);
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from all observables and complete destroy subject
    this.destroy$.next();
    this.destroy$.complete();
  }

  nodeExpand(event) {
    this.getChildren(event.node, false,false);
  }

  private mapFolderToNodeData(data: any, node) {
    return {
      label: data.name,
      data: data.name,
      leaf: false,
      nodeType: 'FOLDER',// FOLDER | PRODUCT | TEST_CASE
      folderData: data,
      product: node.product,
      expanded: false,
      draggable: true,
      droppable: true,
      parent: node,
      children: [],
    }
  }
  onShowContextMenu(event) {

    switch (this.selectedNode.nodeType) {
      case ('PRODUCT'):
        this.items = [
          { label: 'Add Folder', command: (event) => this.open(this.myModel, this.selectedNode.product.product_id, null, 'CREATE_MODE') },
          { label: 'Export to Excel', command: (event) => this.exportTcOfSelectedFolder(this.selectedNode.product) },
          { label: 'Import From Excel', command: (event) => this.importTcOfSelectedFolder(this.selectedNode.product) }
        ]
        break;
      case ('FOLDER'):
        this.items = [
          { label: 'Add Folder', command: (event) => this.open(this.myModel, this.selectedNode.product.product_id, this.selectedNode.folderData, 'CREATE_MODE') },
          { label: 'Add Test Case', command: (event) => this.createTestCase(this.userStoryId, this.selectedNode.folderData) },
          { label: 'Export to Excel', command: (event) => this.exportTcOfSelectedFolder(this.selectedNode.folderData) },
          { label: 'Import From Excel', command: (event) => this.importTcOfSelectedFolder(this.selectedNode.folderData) },
          { label: 'Rename Folder', command: (event) => this.open(this.myModel, this.selectedNode.product.product_id, this.selectedNode.folderData, 'EDIT_MODE') },
        ]
        break;
      default:
        this.items = [
          { label: 'Duplicate Test Case', command: (event) => this.duplicateTestCase(this.userStoryId, this.selectedNode.testCase, this.selectedNode.folderData, true) },
          { label: 'Delete Test Case', command: (event) => this.deleteTestCase(this.selectedNode.testCase.testCaseLibraryId) }
        ];


    }
  }
  nodeEvent(event) {
    this.selecteNode(event.node);
  }
  addActiveClass(node) {
    if (node) {
      if (!node.styleClass || node.styleClass.indexOf('active') === -1) {
        node.styleClass = (node.styleClass ? node.styleClass + ' ' : '') + 'active';
      } if (node.parent) {
        this.addActiveClass(node.parent);
      }
    }
  }
  removeActiveClassFromDifferentProduct(node) {
    if (node.styleClass && node.styleClass.indexOf('active') !== -1) {
      node.styleClass = node.styleClass.replace('active', '').trim();
    } if (node.children.length !== 0) {
      node.children.forEach((element, childrenIndex) => {
        this.removeActiveClass(node.children[childrenIndex]);

      });
    }
  }
  async getChildren(node, existTestCase,hasSelectedNameFromBreadcrumb) {
    const childNodes = [];

    if(this.selectedNode && this.selectedNameFromBreadcrumb && this.selectedNameFromBreadcrumb[this.selectedNameFromBreadcrumb.length-1] === this.selectedNode.label){
      this.selectedLibraryObject.emit(node);
    }
    if (node.nodeType === 'PRODUCT') {
      await this.foldersService.getFoldersByParentId(node.product.product_id)
        .pipe(takeUntil(this.destroy$))
        // tslint:disable-next-line:no-shadowed-variable
        .subscribe(async (data) => {
          await data.forEach(folder => {
            childNodes.push(this.mapFolderToNodeData(folder, node))
          })

          node.children = childNodes;
          if (existTestCase) {
            this.expendedChild(node,null,false);
          }
          if(hasSelectedNameFromBreadcrumb)
          this.expendedChild(node,this.selectedNameFromBreadcrumb,true);


        })

    } else {
      await this.foldersService.getSubFoldersByFolderRefId(node.folderData.folderId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(async (data) => {
        await   data.forEach(subFolder => {
            childNodes.push(this.mapFolderToNodeData(subFolder, node));
          });

         await  this.testCaseLibraryService.getTestCasesLibraryByFolderId(node.folderData.folderId)
            .pipe(takeUntil(this.destroy$))
            .subscribe(testCasesLibraryList => {
              testCasesLibraryList.forEach(tc => {
                const testCaseNode = {
                  label: tc.shortDescription,
                  data: tc.shortDescription,
                  folderData: node.folderData,
                  nodeType: 'TEST_CASE',
                  leaf: true,
                  testCase: tc,
                  expanded: false,
                  draggable: true,
                  droppable: false,
                  parent: node,
                  children: [],
                  product: node.product,
                  icon: "icon-file"
                }
                if (this.testCaseSelected && existTestCase) {
                  if (tc.testCaseLibraryId === this.testCaseSelected.testCaseLibraryId) {
                    this.selectedNode = testCaseNode;
                    this.selectedLibraryObject.emit(testCaseNode);
                  }
                }

                childNodes.push(testCaseNode);

              });
            });
          node.children = childNodes;
          if (existTestCase) {
            this.expendedChild(node,null,false);
          }
          if(hasSelectedNameFromBreadcrumb)
          this.expendedChild(node,this.selectedNameFromBreadcrumb,true);

        });
    }

  }

  onDrop(event) {
    if (event.dropNode.nodeType === 'PRODUCT') {
      const folder = {
        folderId: event.dragNode.folderData.folderId,
        parentId: event.dropNode.product.product_id,
        parentFolderRefId: null,
      }
      this.foldersService.dragAndDropFolder(folder, folder.folderId).subscribe(data => {
        event.dropNode.expanded = true;
        this.getChildren(event.dropNode, false,false);
      })
    }
    else if (event.dragNode.nodeType === 'FOLDER' && event.dropNode.nodeType !== 'PRODUCT') {
      const folder = {
        folderId: event.dragNode.folderData.folderId,
        parentId: event.dropNode.product.product_id,
        parentFolderRefId: event.dropNode.folderData.folderId
      }
      this.foldersService.dragAndDropFolder(folder, folder.folderId).subscribe(data => {
        event.dropNode.expanded = true;
        this.getChildren(event.dropNode, false,false);
      })
    } else {
      const dragAndDropTestCaseDTO = {
        dropFolderId: event.dropNode.folderData.folderId,
        productId: event.dropNode.product.product_id
      }
      this.testCaseLibraryService.dragAndDropTC(dragAndDropTestCaseDTO, event.dragNode.testCase.testCaseLibraryId).subscribe(data => {
        event.dropNode.expanded = true;
        this.getChildren(event.dropNode, false,false);
      });
    }

  }


  expendedChild(node,selectedNameFromBreadcrumb,hasSelectedNameFromBreadcrumb) {
    if (selectedNameFromBreadcrumb && node.label === selectedNameFromBreadcrumb[selectedNameFromBreadcrumb.length - 1]) {
      this.selectedLibraryObject.emit(node);
    } 
    if (node.children.length !== 0) {
      node.children.forEach((element, index) => {
        if (element.nodeType !== 'TEST_CASE') {
          if ((hasSelectedNameFromBreadcrumb && selectedNameFromBreadcrumb.includes(element.folderData.name)) || (!selectedNameFromBreadcrumb && this.folderIds.length !== 0 && this.folderIds.includes(element.folderData.folderId.toString()))) {
            

            if (!node.children[index].expanded) {
              node.children[index].expanded = true;
              this.getChildren(node.children[index], true,hasSelectedNameFromBreadcrumb);
            } else {
              this.expendedChild(node.children[index],selectedNameFromBreadcrumb,hasSelectedNameFromBreadcrumb);
            }
          }
        }
        this.addActiveClass(node.children[index].parent);

      });
    }
  }
  updateTree(tree: any, testCaseLibrary,selectedNameFromBreadcrumb,hasSelectedNameFromBreadcrumb) {

    if(testCaseLibrary){
    this.folderIds = this.testCaseSelected.folder.folderPathIds.split('/');
    }
    else{
      this.folderIds=[];
    }
    tree.forEach((node, index) => {
      if ((testCaseLibrary && node.product.product_id === testCaseLibrary.productId)||(hasSelectedNameFromBreadcrumb && this.selectedNode&& node.product.product_id === this.selectedNode.product.product_id)) {
         this.initNode.emit(node);
        if (!tree[index].expanded) {
          tree[index].expanded = true;
          this.getChildren(tree[index], true,hasSelectedNameFromBreadcrumb);
        } else {
          this.expendedChild(tree[index],selectedNameFromBreadcrumb,hasSelectedNameFromBreadcrumb);
        }
      }
    })
  }

  async deleteTestCase(id) {
    const confirmed = await this.confirmationDialogService.confirm(
      'delete Test Case',
      'Test Case will be deleted' + '. Could you please confirm with OK?'
    );
    if (!confirmed) {
      return;
    }
    if (id !== undefined) {
      this.testCaseLibraryService.deleteTestCaseLibrary(id).subscribe(data => {
        if (this.selectedNode && this.selectedNode.parent) {
          let index = this.selectedNode.parent.children.indexOf(this.selectedNode);
          this.selectedNode.parent.children.splice(index, 1);
        }
      })
    }
  }
  findNodeToRemoveActiveClass(currentNode) {
    if (this.prevSelectedNode) {
      this.removeActiveClass(this.prevSelectedNode);
    }
    this.prevSelectedNode = currentNode;

    this.tree.forEach((node, index) => {
      if (node.product.product_id !== this.selectedNode.product.product_id && node.styleClass && node.styleClass.indexOf('active') !== -1) {
        node.styleClass = node.styleClass.replace('active', '').trim();
        if (node.children.length !== 0) {
          this.tree[index].children.forEach((element, childrenIndex) => {
            this.removeActiveClassFromDifferentProduct(this.tree[index].children[childrenIndex]);
          });
        }
      }
    })
  }
  removeActiveClass(node) {
    if (node.styleClass && node.styleClass.indexOf('active') !== -1) {
      node.styleClass = node.styleClass.replace('active', '').trim();
    } if (node.parent) {
      this.removeActiveClass(node.parent);
    }
  }
  selecteNode(node) {
    this.selectedLibraryObject.emit(node);
    this.findNodeToRemoveActiveClass(node);
    this.addActiveClass(node);
    if (node.nodeType === 'TEST_CASE') {
      this.openTestCaseLibraryInEditView(node.testCase);
    }
  }
}

