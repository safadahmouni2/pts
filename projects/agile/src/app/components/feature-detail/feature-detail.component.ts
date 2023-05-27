import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { Feature } from '../../models/feature.model';
import { Product } from '../../models/product.model';
import { Project } from '../../models/project.model';
import { ProjectService } from '../../services/project.service';
import { FeatureGrapgQlService } from '../../services/pts-api/agile/feature.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil, map } from 'rxjs/operators';
import { State } from '../../models/state.model';
import { StateService } from '../../services/state.service';
import { HelperService } from '../../shared/services/helper/helper.service';


@Component({
  selector: 'app-feature-detail',
  templateUrl: './feature-detail.component.html',
})
export class FeatureDetailComponent implements OnInit, OnDestroy {
  @Input() myProduct: Product;
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('feature') featureInput: Feature;
  // eslint-disable-next-line @angular-eslint/no-output-rename, @angular-eslint/no-output-on-prefix
  @Output('onHideFeatureDetail') nofiy: EventEmitter<Feature> = new EventEmitter<Feature>();
  dataLoading = false;
  editModeProject = false;
  editModeName = false;
  editModeDescription = false;
  editModeState = false;
  displaySprintDetailView: boolean;
  productIdSelected: number;
  dropdownListProject: Project[] = [];
  feature: any;
  editableFeature: any;
  destroy$ = new Subject();
  allowedStatesList: State[] ;
  stateName: any;

  constructor(
    private projectService: ProjectService,
    private featureGrapgQlService: FeatureGrapgQlService,
    private stateService: StateService,
    private helper: HelperService
  ) { }

  ngOnInit(): void {
    this.feature = this.helper.cloneObject(this.featureInput);
    this.editableFeature = this.helper.cloneObject(this.feature);
    this.getListPoject();
    this.dataLoading = true;
    this.featureGrapgQlService.getById(this.featureInput.id)
      .pipe(takeUntil(this.destroy$),
        finalize(() => this.dataLoading = false))
      .subscribe(resultGetById => {
        if (resultGetById) {
          this.feature = resultGetById.data.getFeature;
          this.editableFeature = this.helper.cloneObject(this.feature);
          this.getNextAllowedStates(this.feature.stateId);
          this.getStateName(this.feature.stateId);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(undefined);
    this.destroy$.complete();
  }

  public onCloseDetail() {
    this.nofiy.emit(null);
    this.editableFeature = this.helper.cloneObject(this.feature);
  }

  public updateFeatureDescription() {
    this.editModeDescription = false;
    const featureInputData = {
      description: this.editableFeature.description,
    };
    this.updateFeature(featureInputData);
    this.feature.description = featureInputData.description;
  }

  public updateFeatureProject() {
    this.editModeProject = false;
    const featureInputData = {
      project: this.editableFeature.project
    };
    this.updateFeature(featureInputData);
    this.feature.project = featureInputData.project;
  }

  public updateFeatureName() {
    this.editModeName = false;
    const featureInputData = {
      name: this.editableFeature.name
    };
    this.updateFeature(featureInputData);
    this.feature.name = featureInputData.name;
    this.feature.text = featureInputData.name;
    this.featureInput.text = featureInputData.name;
    this.featureInput.name = featureInputData.name;
  }

  public updateFeatureState() {
    this.editModeState = false;
    const featureInputData = {
      stateId: this.editableFeature.stateId
    };
    this.updateFeature(featureInputData);
    this.feature.stateId = featureInputData.stateId;
    this.getStateName(featureInputData.stateId);
    this.getNextAllowedStates(featureInputData.stateId);
  }

  private getListPoject(): void {

    this.projectService.getAllProjectByProduct(this.myProduct.productId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(projectsData => {
        this.dropdownListProject = (projectsData || []).map(item => ({
          id: item.project_id,
          name: item.project_name
        }));
      });
  }
  private updateFeature(featureInputData) {
    this.featureGrapgQlService.updateFeature(this.featureInput.id, featureInputData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((resultUpdateFeature) => {

      });
  }

  /*function  : restore data         */
  public restoreData(dataKey) {
    switch (dataKey) {
      case 'description': {
        this.editableFeature.description = this.feature.description;
        this.editModeDescription = false;
        break;
      }
      case 'name': {
        this.editableFeature.name = this.feature.name;
        this.editModeName = false;
        break;
      }
      case 'project': {
        this.editableFeature.project = this.feature.project;
        this.editModeProject = false;
        break;
      }
      case 'state': {
        this.editableFeature.stateId = this.feature.stateId;
        this.editModeState = false;
        break;
      }      
    }
  }

  /*  function : cahnge data*/
  public changeData(dataKey) {
    switch (dataKey) {
      case 'project':
        this.editModeProject = true;
        break;
      case 'name':
        this.editModeName = true;
        break;
      case 'description':
        this.editModeDescription = true;
        break;
      case 'state':
        this.editModeState = true;
        break;

    }
  }

  public getNextAllowedStates(stateId: number) {
    this.stateService.getNextAllowedStatesForFeature(stateId).pipe(map((dataSource: any) => dataSource.map(stateItem => {
     const state = new State();
     state.stateId = stateItem.status_id;
     state.stateName = stateItem.status_name;
     return state;
   })))
   .subscribe(states => {
     this.allowedStatesList = states;
   });
       }
      
  getStateName(stateId) {
    this.stateService.getStateById(stateId).subscribe(state => {
      if (state) {
        this.stateName = state[0].statusName;
      }
    });
  }
}
