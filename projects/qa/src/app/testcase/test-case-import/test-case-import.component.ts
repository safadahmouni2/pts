import {Component, Input, OnChanges, OnInit, OnDestroy, SimpleChanges} from '@angular/core';
import {TestCaseLibraryService} from "../../services/test-case-library.service";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {SourceSystemService} from "../../services/source-system-service.";
import {SourceSystem} from "../../models/SourceSystem";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";

@Component({
  selector: 'app-test-case-import',
  templateUrl: './test-case-import.component.html',
  styleUrls: ['./test-case-import.component.css']
})
export class TestCaseImportComponent implements OnInit, OnChanges, OnDestroy {

  showSourceSystemDropdown = false;
  selectedFile: File;
  @Input() selectedFolderForImportToParent;
  showSuccessMsg = null;
  showErrorMsg=null;
  sourceSystems: any[] = [];
  selectedSourceSystem = '';
  focusedField = '';
  inputSourceSystemFocused = false;
  fileUploaded = false;
  sourceSystemName = '';
  focusedLabel = false;

  destroy$ = new Subject<void>();

  constructor(
    private testCaseLibraryService: TestCaseLibraryService,
    private sourceSystemService: SourceSystemService,
    private spinner: NgxSpinnerService,
    private toast: ToastrService
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.allSourceSystems();
    if ((changes && changes.selectedFolderForImportToParent) &&
      (changes.selectedFolderForImportToParent?.previousValue != changes?.selectedFolderForImportToParent?.currentValue)) {
      this.ngOnInit();
      if (!this.sourceSystemName) {
        this.sourceSystemName = this.sourceSystems[0]?.name;
        this.focusedLabel = true;
      }
    }
  }
  ngOnInit() {
    this.allSourceSystems();
    this.fileUploaded = true;
    this.showErrorMsg=null;
    this.showSuccessMsg=null;
  }

  ngOnDestroy(): void {
    // Unsubscribe from all observables and complete destroy subject
    this.destroy$.next();
    this.destroy$.complete();
  }

  public uploadExcelFile(event) {
    this.ngOnInit();
    this.selectedFile = event.target.files[0];
    if (!this.sourceSystemName) {
      this.sourceSystemName = this.sourceSystems[0]?.name;
      this.focusedLabel = true;
    }
  }

  public importTestCases() {
    let regex = /[\,\[\]]/g;
    if (this.selectedFile && !this.selectedFile?.name.endsWith("xls")) {
      this.showErrorMsg = "File format should be .xls not xlsx";
    } else {
      if (this.selectedFile) {
        this.spinner.show();
        if (this.selectedFolderForImportToParent && !this.selectedFolderForImportToParent.folderId) {
          this.testCaseLibraryService.uploadProductExcelFile(this.sourceSystemName, this.selectedFile, this.selectedFolderForImportToParent.productId).subscribe(
            (responseDataImport) => {
              if (!responseDataImport.error) {
                this.showSuccessMsg = "File imported successfully";
                this.showErrorMsg =null;
                  this.fileUploaded = true;
              } else {
                this.fileUploaded = false;
                this.showSuccessMsg = null;
                this.showErrorMsg = responseDataImport.message?.replace(regex, "\n");
              }
              this.spinner.hide();
            });
        } else {
          this.testCaseLibraryService.uploadFolderExcelFile(this.sourceSystemName, this.selectedFile, this.selectedFolderForImportToParent.productId, this.selectedFolderForImportToParent.folderId).subscribe(
            (responseDataImport) => {
              if (!responseDataImport.error) {
                this.fileUploaded = true;
                this.showSuccessMsg = "File imported successfully";
              } else {
                this.showErrorMsg = responseDataImport?.message?.replace(regex, "\n");
                this.fileUploaded = false;
                this.showSuccessMsg = null;
              }
              this.spinner.hide();
            });
        }
      }
    }

  }


  private allSourceSystems() {
    this.sourceSystemService.getAllSourceSystems()
      .subscribe(data => {
          this.sourceSystems = data.map(item => ({id: data.indexOf(item), name: item.sourceSystemName}));
        }
        , error => {
          console.log('An error was occurred.')
        });
  }

  setSourceSystem(sourceSystemName: string, event) {
    (sourceSystemName) ? this.sourceSystemName = sourceSystemName : this.sourceSystemName = this.sourceSystems[0].name;
    event.target.parentNode.parentNode.classList.add('focused');
    this.inputSourceSystemFocused = false;
  }

  openDropDown(event) {
    this.inputSourceSystemFocused = true;
  }

  resetSourceSystem(event) {
    event.stopPropagation();
    // get old source system value
    this.sourceSystemName = '';
    this.inputSourceSystemFocused = false;
    this.showSourceSystemDropdown = true;
  }

  public addSourceSystem(sourceSystemName: string, event): void {
    event.stopPropagation();
    let sourceSystemExist = null;
    const sourceSystem = new SourceSystem();
    sourceSystem.sourceSystemName = sourceSystemName;
    this.sourceSystemName = sourceSystemName;
    event.target.parentNode.parentNode.classList.add('focused');
    this.sourceSystemService.getSourceSystemByName(sourceSystemName).pipe(takeUntil(this.destroy$)).subscribe(
      sourceSystemResponse => {
        sourceSystemExist = sourceSystemResponse;
        this.inputSourceSystemFocused = true;
        if (sourceSystemExist) {
          this.toast.error('Source system Already exist')
        } else {
          this.sourceSystemService.createSourceSystem(sourceSystem).pipe(takeUntil(this.destroy$)).subscribe(
            sourceSystemResponse => {
              this.selectedSourceSystem = sourceSystemResponse.sourceSystemName;
              (sourceSystemResponse && sourceSystemResponse?.sourceSystemId) ?
                this.toast.success('Source system created successfully') :
                this.toast.error('Fail to create Source system');
              this.inputSourceSystemFocused = false;
            });
        }
      });
    // event.target.parentNode.parentNode.classList.add('focused');
  }

  toggleSourceSystemDropdown() {
    this.showSourceSystemDropdown = !this.showSourceSystemDropdown;
  }

  fieldSourceSystemFocus(event) {
    if (event.target.value === '') {
      event.target.parentNode.classList.add('focused');
    }
    this.allSourceSystems();
  }

  onChangeSourceSystem(event) {
    this.showSuccessMsg=null;
    this.inputSourceSystemFocused = true;
    if (event && event.target.value) {
      const sourceSystemName = event.target.value;
      // filter when we have a selected value
      this.sourceSystems = this.sourceSystems.filter(source =>
        (source.name.toLowerCase().includes(sourceSystemName.toLowerCase()) || source.name.toUpperCase() === sourceSystemName.toUpperCase()));
      //   this.inputSourceSystemFocused = true;
    }
    if (event.target.value === '') {
      this.allSourceSystems();
    }
  }

  // isDisabled(){
  //   if(!(this.sourceSystemName || this.selectedFile?.name ||  this.showSourceSystemDropdown)){
  //     disbale
  //   }
  // }

  fieldBlurSourceSystem(event) {
    if (event.target.value === '') {
      event.target.parentNode.classList.remove('focused');
    }
  }

  toggleStatusDropdown() {
    this.showSourceSystemDropdown = !this.showSourceSystemDropdown;
  }
}
