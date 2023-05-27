import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PerformancePieComponent } from './components/performance-pie/performance-pie.component';
import { RadarComponent } from './components/radar/radar.component';
import { CreateSOComponent } from './components/create-so/create-so.component';
import { PropositionsComponent } from './components/propositions/propositions.component';
import { HomeComponent } from './components/home/home.component';
import { MypropositionComponent } from './components/myproposition/myproposition.component';
import { ManagePropositionsComponent } from './components/manage-propositions/manage-propositions.component';
import { MyprofileComponent } from './components/myprofile/myprofile.component';
import { TrainingsComponent } from './components/trainings/trainings.component';
import { AuthGuard } from './services/auth.guard';
import { EventDetailsComponent } from './components/event-details/event-details.component';
import { BarsComponent } from './shared/bars/bars.component';
import { HorizentalBarsComponent } from './shared/horizental-bars/horizental-bars.component';
import { EventsComponent } from './shared/events/events.component';
import { RatingComponent } from './shared/rating/rating.component';


const routes: Routes = [
  { path: 'app-bars', component: BarsComponent  },
  { path: 'app-horizental-bars', component: HorizentalBarsComponent },
  { path: 'app-performance-pie', component: PerformancePieComponent},
  { path: 'app-radar', component: RadarComponent},
  { path: 'app-rating', component: RatingComponent },
  { path: 'app-create-so', component: CreateSOComponent},
  { path: 'app-events', component: EventsComponent},
  { path: 'app-propositions', component: PropositionsComponent },
  { path: 'app-mypropositions', component: MypropositionComponent},
  { path: 'app-managepropositions', component: ManagePropositionsComponent},
  { path: 'app-myprofile', component: MyprofileComponent},
  { path: 'app-home', component: HomeComponent },
  { path: 'app-trainings/:status', component: TrainingsComponent},
  { path: 'app-event-details', component: EventDetailsComponent},
  { path: '', redirectTo: '/app-home', pathMatch: 'full' }];

@NgModule({
  imports: [RouterModule.forRoot(routes, {}),
    CommonModule],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }




