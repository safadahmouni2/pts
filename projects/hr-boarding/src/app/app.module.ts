import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {routing} from './app.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HashLocationStrategy, LocationStrategy, DatePipe} from '@angular/common';
/** import My Guard */
import {AuthGuard} from './guards/auth.guard';
/** import My Service */
import {RequestJsonDataService} from './services/requestJsonData.service';
import {TicketService} from './services/ticket.service';
import {AuthenticationService} from './services/authentication.service';
/** import app component */
import {AppComponent} from './app.component';
import {DashbordComponent} from './components/dashbord/dashbord.component';

import {ProcessDetailComponent} from './components/process-detail/process-detail.component';

import {ProcessTypePipe} from './components/dashbord/process-type.pipe';
import {NotFoundComponent} from './components/not-found/not-found.component';


@NgModule({
  declarations: [
    AppComponent,

    DashbordComponent,
    ProcessDetailComponent,

    DashbordComponent,
    ProcessTypePipe,
    NotFoundComponent,

  ],
  imports: [
    BrowserModule
    , routing
    , FormsModule
    , ReactiveFormsModule
    , HttpClientModule

  ],
  providers: [
    AuthGuard
    , DatePipe
    , RequestJsonDataService
    , AuthenticationService
    , TicketService
    , {provide: LocationStrategy, useClass: HashLocationStrategy},

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
