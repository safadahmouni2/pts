
import { Component, Input, OnInit, TemplateRef, OnDestroy, OnChanges } from '@angular/core';
import { Environment } from '../../models/Environment';
import { Install, UserStoryObj } from '../../models/Install';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { InstallServices } from '../../services/installServices';
import { DatePipe } from '@angular/common';
import { Globals } from '../../config/globals';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../../models/Product';
import { DropDownTestRelease } from '../../models/DropDownTestRelease';
import { DropDownPlanRelease } from '../../models/DropDownPlanRelease';
import { TestRelease } from '../../models/TestRelease';
import { PlanRelease } from '../../models/PlanRelease';
import { environment } from '../../../environments/environment';
import { TestRunServices } from '../../services/testRunServices';
import { UserStoryServices } from "../../services/userStoryServices";
import { UserStory } from "../../models/UserStory";
import { takeUntil, finalize, delay } from 'rxjs/operators';
import { Subject, forkJoin } from 'rxjs';
import { ProductsServices } from '../../services/productsServices';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-environment-item',
  templateUrl: './environment-item.component.html',
  styleUrls: ['./environment-item.component.css']
})

export class EnvironmentItemComponent implements OnInit, OnDestroy {
  @Input() environment: any;
  @Input() environmentList: Environment[];
  @Input() currentInstall: Install;
  @Input() testRelease: TestRelease;
  @Input() planRelease: PlanRelease;
  @Input() inProgress: any;
  bsConfig: any;
  installTest;
  plannedInstallExist = false;
  inProgressInstallExist = false;
  focusedFIeld = '';
  startValue: Date;
  datePickerStartStatus = '';
  modalRef: BsModalRef;
  install = new Install();
  userStoryObj = new UserStoryObj();
  showPlanReleaseDropdown = false;
  showTestReleaseDropdown = false;
  showUrgencyDropdown = false;
  product: Product;
  dropDownTestRelease: DropDownTestRelease;
  dropDownPlanRelease: DropDownPlanRelease;
  installReleaseExist = false;
  undoneInstallExist = false;
  installRequestExist = false;
  requestedInstallExist = false;
  msg: string;
  idInstall: number;
  installVersion: string;
  productId: number;
  productName: string;
  installState: any = { created: 'CREATED', InProgress: 'In Progress' };
  chatUrl: string;
  isProd = environment.production;
  baseURL: string = 'https://pts.thinktank.de';
  installs: any;
  public showUSDropdown = false;
  public dropDownUS: DropDownTestRelease;
  public listUserStory: UserStory[] = [];
  projectOptions = [];
  showProjectDropdown = false;
  destroy$ = new Subject();
  collapsedTestRuns = false;
  loadingTestRuns = false;
  loadingInstalls = false;
  constructor(
    private modalService: BsModalService,
    private installService: InstallServices,
    public globals: Globals,
    private toastr: ToastrService,
    private testRunServices: TestRunServices,
    private userStoryServices: UserStoryServices,
    private productService: ProductsServices,
    private spinner: NgxSpinnerService

  ) {
    if (!this.install.date) { this.install.date = new Date(); }
  }


  ngOnInit(): void {
    this.bsConfig = {
      dateInputFormat: 'YYYY-MM-DD hh:mm:ss a',
      rangeInputFormat: 'YYYY-MM-DD hh:mm:ss a',
      withTimepicker: true
    };

    if (this.environment.Install_id > 0) {

      this.installReleaseExist = true;
      this.chatUrl = this.globals.getChatUrl(this.environment.Env_id, 'environment');
      this.installs = Object.assign(
        { installsId: [] },
        { installSelected: this.environment.Install_id },
        {
          installsCoreData: null
        });
      this.installs = { ...this.installs, ...{ countTestRunsSelectedInstall: 0 } };
      this.loadTestCaseByInstall(this.environment.Install_id, this.environment);
    }
    this.getProduct();
  }

  onShowInstallsList(): void {
    this.spinner.show('sp-installs');
    this.loadingInstalls = true;
    this.installs = {
      ...this.installs, ...{ installsId: [] }, ...          {
        installsCoreData: null
      }
    };
    forkJoin([
      this.testRunServices.getInstallsByEnvId(this.environment.Env_id),
      this.installService.getInstallsByEnvIdFromPTS(this.environment.Env_id)
    ])
      .pipe(takeUntil(this.destroy$),
        finalize(() => { this.loadingInstalls = false; this.spinner.hide('sp-installs'); }))
      .subscribe(([installsDataFromQA, installsDataFromCore]) => {
        this.installs = {
          ...this.installs,
          ...{ installsId: installsDataFromQA },
          ...{ installsCoreData: installsDataFromCore.reduce(function (map, obj) {
              map[obj.installId] = obj;
              return map;
            }, {})
          }
        };

      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  private getProduct(): void {
    this.productName = this.globals.getProductName();
    this.getInstallRequest(this.productName);
  }

  private getInstallRequest(productName: string): void {
    const productId = + this.globals.getProductId();
    const envId = this.environment.Env_id;
    const environmentName = this.environment.Env_name;
    this.installService.getInstallFromPTS(productName, environmentName)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.installTest = data;
        if (this.installTest.length !== 0) {
          this.undoneInstallExist = true;
          this.idInstall = this.installTest[0].install_id;
          this.msg = this.installTest[0].msg;
          if (this.installTest[0].state === this.installState.created) {
            this.plannedInstallExist = true;
            this.inProgressInstallExist = false;
          }
          if (this.installTest[0].state === this.installState.InProgress) {
            this.plannedInstallExist = false;
            this.inProgressInstallExist = true;
          }

        } else {
          this.undoneInstallExist = false;
        }
        if (!this.undoneInstallExist) {
          this.installService.getInstallFromPTS_QA(productId, envId)
            .pipe(takeUntil(this.destroy$))
            .subscribe(data => {
              this.installTest = data;
              if (this.installTest != null) {
                this.installRequestExist = true;
                this.idInstall = this.installTest.installId;
                this.installVersion = this.installTest.installVersion;
                this.userStoryObj.userStoryId = this.installTest.userStoryId;
                this.msg = this.installTest.description;
                if (this.installTest.state === this.installState.created) {
                  this.plannedInstallExist = false;
                  this.inProgressInstallExist = false;
                  this.requestedInstallExist = true;
                  this.install = this.installTest;
                  if (this.install.date) {
                    this.startValue = this.install.date;
                  }
                }
              } else {
                this.installRequestExist = false;
              }
            });
        }
      });

  }

  public onClickOpenModal(template: TemplateRef<any>, install: any = null): void {

    forkJoin([
      this.installService.getTestRelease(1, 500, this.productName),
      this.installService.getPlanRelease(1, 500, this.productName),
      this.userStoryServices.getUserStoryBySprintId(parseInt(this.globals.getSprintId())),
      this.productService.getAllProjectsByProductId(+this.globals.getProductId())
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([dropDownTestRelease, dropDownPlanRelease, listUserStory, allProjectsByProductIdRs]) => {
        this.dropDownTestRelease = dropDownTestRelease;
        this.dropDownPlanRelease = dropDownPlanRelease;
        this.listUserStory = listUserStory;
        this.projectOptions = allProjectsByProductIdRs;

        if (install) {
          const userStoryUpdate = this.listUserStory.filter(us => us.id === install.userStoryId).map((u => u.text));
          this.userStoryObj.userStoryName = userStoryUpdate[0];
        }

        if (this.dropDownTestRelease.total > 1 && this.dropDownPlanRelease.total <= 1) {
          this.installService.getTestRelease(1, this.dropDownTestRelease.records, this.productName)
            .pipe(takeUntil(this.destroy$))
            .subscribe(testReleasesData => {
              this.dropDownTestRelease = testReleasesData;
              this.modalRef = this.modalService.show(template);
            }
            );
        } else if (this.dropDownTestRelease.total <= 1 && this.dropDownPlanRelease.total > 1) {
          this.installService.getPlanRelease(1, this.dropDownPlanRelease.records, this.productName)
            .pipe(takeUntil(this.destroy$))
            .subscribe(planReleasesData => {
              this.dropDownPlanRelease = planReleasesData;
              this.modalRef = this.modalService.show(template);
            }
            );
        } else if (this.dropDownTestRelease.total > 1 && this.dropDownPlanRelease.total > 1) {
          forkJoin([this.installService.getTestRelease(1, this.dropDownPlanRelease.records, this.productName)
            , this.installService.getPlanRelease(1, this.dropDownPlanRelease.records, this.productName)])
            .pipe(takeUntil(this.destroy$))
            .subscribe(results => {
              this.dropDownTestRelease = results[0];
              this.dropDownPlanRelease = results[1];
              this.modalRef = this.modalService.show(template);
            });
        } else {
          this.modalRef = this.modalService.show(template);
        }
      })

  }

  public fieldFocus(event, focusedFIeld): void {
    event.target.parentNode.classList.add('focused');
    this.focusedFIeld = focusedFIeld;
  }

  public fieldBlur(event): void {
    if (event.target.value === '') {
      event.target.parentNode.classList.remove('focused');
    }
    this.focusedFIeld = '';
  }

  public setPlanRelease(version: string, event): void {
    this.install.installVersion = version;
    this.showPlanReleaseDropdown = false;
    event.target.parentNode.parentNode.classList.add('focused');
  }

  public setTestRelease(version2: string, event): void {
    this.install.requestedRelease = version2;
    this.showTestReleaseDropdown = false;
    event.target.parentNode.parentNode.classList.add('focused');
  }

  public setUrgency(urgency: string, event): void {
    this.install.urgency = urgency;
    this.showUrgencyDropdown = false;
    event.target.parentNode.parentNode.classList.add('focused');
  }

  public toggleProjectDropdown(): void {
    this.showProjectDropdown = !this.showProjectDropdown;
  }
  public setInstallProject(projectName: string, event): void {
    this.install.project = projectName;
    this.showProjectDropdown = false;
    event.target.parentNode.parentNode.classList.add('focused');
  }


  public cancel(): void {
    if (!this.requestedInstallExist) {
      this.install = new Install();
    }
    this.modalRef.hide();
  }

  public togglePlanReleaseDropdown(): void {
    this.showPlanReleaseDropdown = !this.showPlanReleaseDropdown;
  }

  public toggleTestReleaseDropdown(): void {
    this.showTestReleaseDropdown = !this.showTestReleaseDropdown;
  }

  public toggleUrgencyDropdown(): void {
    this.showUrgencyDropdown = !this.showUrgencyDropdown;
  }

  public addInstall(): void {

    this.install.envId = this.environment.Env_id;
    this.install.productId = + this.globals.getProductId();
    this.install.targetSprintId = + this.globals.getSprintId();
    this.installService.addInstall(this.install)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.modalRef.hide();
        this.toastr.success('Install created successfully');
        this.getInstallRequest(this.productName);
      },
        err => { console.log(err); }
      );
  }

  public updateInstall(): void {

    this.install.userStoryId = this.userStoryObj.userStoryId;
    this.install.targetSprintId = +this.globals.getSprintId();
    this.install.envId = this.environment.Env_id;
    this.install.productId = + this.globals.getProductId();
    this.installService.updateInstall(this.install)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.modalRef.hide();
        this.toastr.success('Install updated successfully');
        this.getInstallRequest(this.productName);
      },
        err => { console.log(err); }
      );
  }

  public getPlannedInstallChatUrl(): string {
    return this.globals.getChatUrl(this.installTest[0].install_id, 'install');
  }

  getTestCaseByInstall(event, installId: any, env: any) {
    event.preventDefault();
    this.loadTestCaseByInstall(installId, env);
  }

  private loadTestCaseByInstall(installId: any, env: any) {

    this.installs = Object.assign(this.installs, { isCurrentInstall: false })
    if (installId === env.Install_id) {
      this.installs.isCurrentInstall = true;
    }
    this.loadTestRunsStatisticByinstall(installId);
  }

  loadTestRunsStatisticByinstall(installId: number) {
    this.collapsedTestRuns = false;
    this.installs.testRuns = [];
    this.testRunServices.countTestRunsByInstall(installId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.installs.installSelected = installId;
        this.installs.countTestRunsSelectedInstall = data;
      });
  }

  loadTestRunsByInstall(installId: number) {
    this.collapsedTestRuns = !this.collapsedTestRuns;
    this.installs.testRuns = [];
    if (this.collapsedTestRuns) {
      this.loadingTestRuns = true;
      forkJoin([
        this.testRunServices.getTestRunByInstall(installId),
        this.testRunServices.countTestRunsByInstall(installId)
      ]).pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loadingTestRuns = false)
      )
        .subscribe(([testRunsByInstallData, countTestRunsByInstallData]) => {
          this.installs.installSelected = installId;
          this.installs.countTestRunsSelectedInstall = countTestRunsByInstallData;
          this.installs = Object.assign(this.installs, { testRuns: testRunsByInstallData?.sort((a, b) => a.testRunId < b.testRunId ? 1 : -1) });

        });
    }
  }

  public toggleUserStoryDropdown(): void {
    this.showUSDropdown = !this.showUSDropdown;
  }
  public setUserStory(us, event): void {
    this.install.userStoryId = us.id;
    this.userStoryObj.userStoryName = us.text;
    this.userStoryObj.userStoryId = us.id;
    this.showUSDropdown = false;
    event.target.parentNode.parentNode.classList.add('focused');
  }

  getUserStoryBySprintId() {
    this.userStoryServices.getUserStoryBySprintId(parseInt(this.globals.getSprintId()))
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        data => {
          this.listUserStory = data;
        });
  }
}
