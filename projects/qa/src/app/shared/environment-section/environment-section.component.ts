import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { InstallServices } from '../../services/installServices';
import { NgxSpinnerService } from 'ngx-spinner';
import { Product } from '../../models/Product';
import { Globals } from '../../config/globals';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-environment-section',
  templateUrl: './environment-section.component.html',
  styleUrls: ['./environment-section.component.css']
})
export class EnvironmentSectionComponent implements OnInit, OnDestroy {
  @Input() environment: any;
  currentInstall: any;
  product: Product;
  inProgress: boolean;
  destroy$ = new Subject();

  constructor(
    private installServices: InstallServices,
    private spinner: NgxSpinnerService,
    public globals: Globals) {
  }

  ngOnInit(): void {
    this.spinner.show();
    const productName = this.globals.getProductName();
    this.installServices.getInstallFromPTS(productName, this.environment.Env_name)
      .pipe(takeUntil(this.destroy$),
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe(data => {
        this.currentInstall = data;
        if (this.currentInstall.length !== 0) {
          if (this.currentInstall[0].state === 'In Progress') {
            this.inProgress = true;
          } else {
            this.inProgress = false;
          }
        }
      }, error => {
        console.log('An error was occurred.');
      }
      );

  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
