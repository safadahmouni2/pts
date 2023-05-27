import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SideNavigationModule } from '../../shared/components/side-navigation/side-navigation.module';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home/home.component';
import { CoreModule } from '../core/core.module';

import {MatIconModule} from '@angular/material/icon';


@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SideNavigationModule,
    CoreModule,
    MatIconModule
  ]
})
export class DashboardModule { }
