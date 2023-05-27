import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestCaseChangeRequestsComponent } from './test-case-change-requests.component';
import { TestCaseChangeRequestListComponent } from './test-case-change-request-list/test-case-change-request-list.component';
import { TestCaseChangeRequestManagerComponent } from './test-case-change-request-manager/test-case-change-request-manager.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { headerModule } from '../shared/header/header.module';
import { RouterModule } from '@angular/router';
import {ActorInfoModule} from "../shared/show-actor-info/actor-info.module";


@NgModule({
    imports: [
        CommonModule,
        TabsModule,
        PerfectScrollbarModule,
        FormsModule,
        headerModule,
        RouterModule,
     ActorInfoModule
    ],
    declarations: [
        TestCaseChangeRequestsComponent,
        TestCaseChangeRequestListComponent,
        TestCaseChangeRequestManagerComponent,
    ],

})
export class TestCaseChangeRequestsModule { }
