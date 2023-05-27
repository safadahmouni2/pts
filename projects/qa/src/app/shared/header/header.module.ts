
import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { HeaderNavigationComponent } from './header-navigation/header-navigation.component';
import { AppRoutingModule } from '../../app-routing.module';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
    imports: [
        CommonModule,
        AppRoutingModule,
        BrowserModule,
        FormsModule
    ],
    declarations: [
        HeaderComponent,
        HeaderNavigationComponent,

    ],
    exports: [
        HeaderComponent
    ]
})
export class headerModule { }