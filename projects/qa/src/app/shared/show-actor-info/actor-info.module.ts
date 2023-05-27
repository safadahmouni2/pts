import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ShowActorInfoComponent} from "./show-actor-info.component";
import {BrowserModule} from "@angular/platform-browser";
import {AppRoutingModule} from "../../app-routing.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule} from "@angular/forms";
import {BsDropdownModule} from "ngx-bootstrap/dropdown";


@NgModule({
  imports: [
    CommonModule, BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    BsDropdownModule.forRoot(),
  ],
  declarations: [
    ShowActorInfoComponent,
  ],
  exports: [
    ShowActorInfoComponent
  ]
})
export class ActorInfoModule {


}
