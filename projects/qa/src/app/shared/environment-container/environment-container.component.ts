import { Component, OnChanges, OnDestroy, Input, SimpleChanges } from '@angular/core';
import { EnvironmentServices } from '../../services/environmentServices';
import { Environment } from '../../models/Environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { Globals } from '../../config/globals';
import { Product } from '../../models/Product';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-environment-container',
  templateUrl: './environment-container.component.html',
  styleUrls: ['./environment-container.component.css']
})
export class EnvironmentContainerComponent implements OnChanges, OnDestroy {

  @Input() productName;
  @Input() textEnvFilter: any;
  @Input() filterByState: any;

  allEnvironments: Environment[];
  environmentList: Environment[];
  environment: Environment;
  dataLoading = true;
  product: Product;

  destroy$ = new Subject();

  constructor(
    private environmentServices: EnvironmentServices,
    private spinner: NgxSpinnerService,
    public globals: Globals) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.productName) {
      this.loadEnvironmentsByProduct(this.productName);
    }
    if (changes.filterByState || changes.textEnvFilter) {
        this.environmentList = this.filterEnvironments(this.filterByState, this.textEnvFilter);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  private loadEnvironmentsByProduct(param: string): void {
    this.spinner.show();
    this.environmentServices.getEnvironmentByProduct(param)
      .pipe(takeUntil(this.destroy$),
        finalize(() => {
          this.spinner.hide();
          this.dataLoading = false;
        }))
      .subscribe(data => {
        this.allEnvironments = data;
        this.environmentList = data;
        if (this.filterByState || this.textEnvFilter) {
          this.environmentList = this.filterEnvironments(this.filterByState, this.textEnvFilter);
        }

      }
      );
  }

  private filterEnvironments(state: any, freeSearchText: any): Environment[] {
    let filteredEnvironmentList: Environment[];
    filteredEnvironmentList = this.allEnvironments?.filter(env =>
      (!state || (env.State && env.State.toLocaleLowerCase().includes(state.toLocaleLowerCase())))
    );
    if (freeSearchText) {
      const freeSearchLowerCase = freeSearchText.toLocaleLowerCase();
      filteredEnvironmentList = filteredEnvironmentList?.filter(env =>
        (env.Env_name && env.Env_name.toLocaleLowerCase().includes(freeSearchLowerCase))
        || (env.Env_type && env.Env_type.toLocaleLowerCase().includes(freeSearchLowerCase))
        || (env.Product && env.Product.toLocaleLowerCase().includes(freeSearchLowerCase))
        || (env.description && env.description.toLocaleLowerCase().includes(freeSearchLowerCase))
        || (env.Installed_release && env.Installed_release == freeSearchText)
      );
    }
    return filteredEnvironmentList;
  }

}
