import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComponentsComponent } from './components/components.component';
import { CommonModule, HashLocationStrategy, LocationStrategy, DatePipe } from '@angular/common';
import { NvD3Module } from 'ng2-nvd3';
import { PerformancePieComponent, ModalPerformance } from './components/performance-pie/performance-pie.component';
import 'nvd3';
import { RadarComponent, ModalRadar } from './components/radar/radar.component';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GaugeModule } from 'angular-gauge';
import { GaugeChartModule } from './shared/angular-gauge-chart/gauge-chart.module';
import { CreateSOComponent, NgbdModalContent } from './components/create-so/create-so.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';
import { ButtonsModule, TooltipModule, PopoverModule } from 'ngx-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PropositionsComponent } from './components/propositions/propositions.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { HomeComponent } from './components/home/home.component';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MypropositionComponent } from './components/myproposition/myproposition.component';
import { ManagePropositionsComponent } from './components/manage-propositions/manage-propositions.component';
import { MyprofileComponent } from './components/myprofile/myprofile.component';
import { BehaviorPieComponent, ModalBehavior } from './components/behavior-pie/behavior-pie.component';
import { ServicesComponent } from './components/services/services.component';
import { NgbActiveModal, } from '@ng-bootstrap/ng-bootstrap';
import { TrainingService } from './components/services/TrainingService';
import { TrainingsComponent} from './components/trainings/trainings.component';
import { AuthService } from './services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { AlertService } from './services/alert.service';
import { SortableModule } from 'ngx-bootstrap/sortable';
import {SOservice} from './components/services/SOserice';
import { EventDetailsComponent } from './components/event-details/event-details.component';
import { NotificationsComponent } from './shared/notifications/notifications.component';
import { FilterComponent } from './shared/filter/filter.component';
import { SearchBarComponent, ModalNotificationComponent } from './shared/search-bar/search-bar.component';
import { MenuComponent } from './shared/menu/menu.component';
import { EventsComponent } from './shared/events/events.component';
import { AlertComponent } from './shared/alerts/alerts.component';
import { BarsComponent, ModalBars } from './shared/bars/bars.component';
import { HorizentalBarsComponent, ModalHorizentalBars } from './shared/horizental-bars/horizental-bars.component';
import { ModalRating, RatingComponent } from './shared/rating/rating.component';
import { FreeSearchComponent } from './shared/free-search/free-search.component';
@NgModule({
    declarations: [
        AppComponent,
        ComponentsComponent,
        BarsComponent,
        HorizentalBarsComponent,
        PerformancePieComponent,
        BehaviorPieComponent,
        RadarComponent,
        RatingComponent,
        CreateSOComponent,
        NgbdModalContent,
        EventsComponent,
        PropositionsComponent,
        HomeComponent,
        MenuComponent,
        SearchBarComponent,
        ModalBars,
        ModalHorizentalBars,
        ModalRadar,
        ModalPerformance,
        ModalBehavior,
        ModalRating,
        MypropositionComponent,
        ManagePropositionsComponent,
        MyprofileComponent,
        BehaviorPieComponent,
        FilterComponent,
        NotificationsComponent,
        ServicesComponent,
        TrainingService,
        TrainingsComponent,
        AlertComponent,
        ModalNotificationComponent,
        SOservice,
        EventDetailsComponent,
        FreeSearchComponent
    ],
    imports: [
        BrowserModule,
        JsonpModule,
        AppRoutingModule,
        CommonModule,
        NvD3Module,
        ChartsModule,
        NgxChartsModule,
        GaugeModule,
        GaugeChartModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatNativeDateModule,
        ButtonsModule.forRoot(),
        BsDatepickerModule.forRoot(),
        AccordionModule.forRoot(),
        BsDropdownModule.forRoot(),
        TooltipModule.forRoot(),
        PopoverModule.forRoot(),
        HttpClientModule,
        SortableModule.forRoot()
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA],
    providers: [
        HomeComponent,
        BarsComponent,
        HorizentalBarsComponent,
        RadarComponent,
        PerformancePieComponent,
        BehaviorPieComponent,
        RatingComponent,
        PropositionsComponent,
        MypropositionComponent,
        ManagePropositionsComponent,
        NotificationsComponent,
        ServicesComponent,
        NgbActiveModal,
        TrainingService,
        CreateSOComponent,
        NgbdModalContent,
        TrainingsComponent,
        AuthService,
        AlertService,
        DatePipe,
        { provide: LocationStrategy, useClass: HashLocationStrategy }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
