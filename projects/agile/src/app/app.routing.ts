import { Routes, RouterModule } from '@angular/router';

import { DailyScrumComponent } from './components/daily-scrum/daily-scrum.component';
import { ManagmentUS } from './components/managment-us/managment-us.component';
import { Dashbord } from './components/dashbord/dashbord.component';
import { SprintPlanningComponent } from './components/sprint-planning/sprint-planning.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { AuthGuard } from './guards/index';
import { AssignUsToSprintComponent } from './components/assign-us-to-sprint/assign-us-to-sprint.component';
import { ManagementQmComponent } from './components/management-qm/management-qm.component';
import { SprintBurndownChartComponent } from './components/sprint-burndown-chart/sprint-burndown-chart.component';
import { ManagementUsFeatureComponent } from './components/management-us-feature/management-us-feature.component';
import { ReviewMeetingComponent } from './components/review-meeting/review-meeting.component';


const appRoutes: Routes = [
    {
        path: 'daily-scrum/:id',
        component: DailyScrumComponent,
        canActivate: [AuthGuard],
        data: { title: 'Daily Scrum Dashboard' }
    },
    {
        path: 'managment-us/:id',
        component: ManagmentUS,
        canActivate: [AuthGuard],
        data: { title: 'User Story Management' }
    },
    {
        path: 'dashbord',
        component: Dashbord,
        canActivate: [AuthGuard],
        data: { title: 'Dashboard' }
    },
    {
        path: 'sprint-planning/:id',
        component: SprintPlanningComponent,
        canActivate: [AuthGuard],
        data: { title: 'Sprint Planning' }
    },
    {
        path: 'assign-us-to-sprint/:id',
        component: AssignUsToSprintComponent,
        canActivate: [AuthGuard],
        data: { title: 'Assign US to Sprint' }
    },
    { path: 'pageNotFound', component: PageNotFoundComponent, data: { title: 'Page not found' } },
    {
        path: 'user-story-status-change/:sprintId/:stateId',
        component: ManagementQmComponent,
        canActivate: [AuthGuard],
        data: { title: 'Status Change' }
    },
    {
        path: 'sprint-chart/:sprintId',
        component: SprintBurndownChartComponent,
        canActivate: [AuthGuard],
        data: { title: 'Burndown' }
    },
    {
        path: 'management-us-feature/:id',
        component: ManagementUsFeatureComponent,
        canActivate: [AuthGuard],
        data: { title: 'Assign US to Feature' }
    },
    {
        path: 'review/:id',
        component: ReviewMeetingComponent,
        canActivate: [AuthGuard],
        data: { title: 'Review Dashboard' }
    },


    // otherwise redirect to pageNotFound

    { path: '', redirectTo: 'dashbord', pathMatch: 'full' },
    { path: '**', redirectTo: 'pageNotFound' }
];

export const routing = RouterModule.forRoot(appRoutes, {});
