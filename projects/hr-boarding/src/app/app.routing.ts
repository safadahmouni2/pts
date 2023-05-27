import {Routes, RouterModule} from '@angular/router';
import {DashbordComponent} from './components/dashbord/dashbord.component';
import {AuthGuard} from './guards/auth.guard';
import {ProcessDetailComponent} from './components/process-detail/process-detail.component';
import {NotFoundComponent} from './components/not-found/not-found.component';

const appRoutes: Routes = [


  {path: 'dashbord', component: DashbordComponent, canActivate: [AuthGuard], data: {title: 'PTS-HR :: Dashboard'}},
  {path: 'process-detail/:id', component: ProcessDetailComponent, canActivate: [AuthGuard], data: {title: 'PTS-HR :: Process detail'}},
  {path: 'pageNotFound', component: NotFoundComponent, data: {title: '404'}},

  // otherwise redirect to home

  { path: '', redirectTo: 'dashbord', pathMatch: 'full' },
  {path: '**', redirectTo: 'pageNotFound'}
];

export const routing = RouterModule.forRoot(appRoutes, {});
