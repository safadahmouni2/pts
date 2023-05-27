import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';


/** import My Service */
import { BaseService } from './services/base.service';
import { UserStoryService } from './services/userstory.service';
import { CommentService } from './services/comment.service';
import { ProjectService } from './services/project.service';
import { StateService } from './services/state.service';
import { PrioService } from './services/prio.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { ManagmentUS } from './components/managment-us/managment-us.component';
import { Dashbord } from './components/dashbord/dashbord.component';
import { DatePipe } from '@angular/common';




import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';


import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PopoverModule } from 'ngx-bootstrap/popover';




import { routing } from './app.routing';

import { AuthGuard } from './guards/index';
import { AuthenticationService, SprintService, UserService, DailyScrumService } from './services/index';
import { DailyScrumComponent } from './components/daily-scrum/index';
import { DragulaModule, DragulaService } from 'ng2-dragula';
import { DragndropComponent } from './components/dragndrop/dragndrop.component';
import { SocketioService } from './services/socketio.service';
import { TaskService } from './services/task.service';
import { ProductService } from './services/product.service';
import { TeamlistComponent } from './components/teamlist/teamlist.component';
import { DashboardHeaderComponent } from './components/dashboard-header/dashboard-header.component';
import { AssignUsToSprintComponent } from './components/assign-us-to-sprint/assign-us-to-sprint.component';


import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { SprintPlanningComponent } from './components/sprint-planning/sprint-planning.component';
import { UsDetailComponent } from './components/us-detail/us-detail.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { ManagementUSFilterPipe } from './components/managment-us/management-us-filter.pipe';
import { FilterUserStoryPipe } from './components/management-qm/filterUserStory.pipe';
import { UserStoryComponent } from './components/user-story/user-story.component';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { CommentListComponent } from './components/comment-list/comment-list.component';
import { CommentComponent } from './components/comment/comment.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskComponent } from './components/task/task.component';
import { CreateSprintComponent } from './components/create-sprint/create-sprint.component';
import { ManagementSpTeamComponent } from './components/management-sp-team/management-sp-team.component';
import { SprintsFilterPipe } from './components/assign-us-to-sprint/sprintsFiltre.pipe';

import { CKEditorModule } from 'ng2-ckeditor';
import { NouisliderModule } from 'ng2-nouislider';
import { TopicComponent } from './components/topic/topic.component';
import { SplitPaneModule } from './shared/ng2-split-pane/ng2-split-pane'
import { ManagementQmComponent } from './components/management-qm/management-qm.component';
import { HeaderComponent } from './components/header/header.component';
import { SprintBurndownChartComponent } from './components/sprint-burndown-chart/sprint-burndown-chart.component';
import { TopicDetailComponent } from './components/topic-detail/topic-detail.component';
import { FeatureComponent } from './components/feature/feature.component';
import { FeatureDetailComponent } from './components/feature-detail/feature-detail.component';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { ApolloModule } from 'apollo-angular';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ManagementUsFeatureComponent } from './components/management-us-feature/management-us-feature.component';
import { ManagementUSFeatureFilterPipe } from './components/management-us-feature/management-us-feature-filter.pipe';
import { ResizableDirective } from './shared/directive/resizable.directive';
import { MeetingConfigComponent } from './components/meeting-config/meeting-config.component';
import { ReviewMeetingComponent } from './components/review-meeting/review-meeting.component';
import { MeetingHeaderComponent } from './components/meeting-header/meeting-header.component';
import { MeetingComponent } from './components/meeting/meeting.component';
import { MeetingTeamListComponent } from './components/meeting-team-list/meeting-team-list.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
  };


@NgModule({
    declarations: [
        AppComponent,
        ManagmentUS,
        Dashbord,
        PageNotFoundComponent,
        DailyScrumComponent,
        DragndropComponent,
        TeamlistComponent,
        DashboardHeaderComponent,
        SprintPlanningComponent,
        UsDetailComponent,
        UserStoryComponent,
        ManagementUSFilterPipe,
        CommentListComponent,
        CommentComponent,
        TaskListComponent,
        TaskComponent,
        CreateSprintComponent,
        ManagementSpTeamComponent,
        AssignUsToSprintComponent,
        TopicComponent,
        ManagementQmComponent,
        FilterUserStoryPipe,
        HeaderComponent,
        SprintBurndownChartComponent,
        SprintsFilterPipe,
        TopicDetailComponent,
        FeatureComponent,
        FeatureDetailComponent,
        ManagementUsFeatureComponent,
        ManagementUSFeatureFilterPipe,
        ResizableDirective,
        MeetingConfigComponent,
        ReviewMeetingComponent,
        MeetingHeaderComponent,
        MeetingComponent,
        MeetingTeamListComponent
    ],
    imports: [
        TypeaheadModule.forRoot(),
        BrowserModule,
        FormsModule,
        //DragulaModule,
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule ,
        routing,
        DragulaModule.forRoot(),
        ToastrModule.forRoot(),
        AccordionModule.forRoot(),
        BsDatepickerModule.forRoot(),
        TimepickerModule.forRoot(),
        PopoverModule.forRoot(),
        AngularMultiSelectModule,
        PerfectScrollbarModule,
        CKEditorModule,
        NouisliderModule,
        SplitPaneModule,
        TooltipModule.forRoot(),
        ApolloModule,
        DragDropModule
    ],
    providers: [
        DatePipe,
        BaseService,
        UserStoryService,
        ProductService,
        DragulaService,
        {provide: PERFECT_SCROLLBAR_CONFIG,
        useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
        AuthGuard,
        AuthenticationService,
        UserService,
        TaskService,
        SprintService,
        UserStoryService,
        SocketioService,
        DailyScrumService,
        CommentService,
        ProjectService,
        StateService,
        PrioService,
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
    bootstrap: [AppComponent]
})
export class AppModule { }
