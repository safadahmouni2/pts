import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './ptsChat/chat/chat.component';




const routes: Routes = [
  {path: 'ticket/:id', component: ChatComponent},

  ];


@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
