import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideNavigationComponent } from './side-navigation.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    SideNavigationComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
  ],
  exports: [
    SideNavigationComponent
  ]
})
export class SideNavigationModule { }
