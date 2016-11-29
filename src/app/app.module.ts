import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, Router, RouterModule, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { EntranceComponent } from './entrance/entrance.component';
import { LobbyComponent } from './lobby/lobby.component';
import { RoomComponent } from './room/room.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';

import { VideocenterService } from './providers/videocenter.service';
let link: Routes = [
  { path: '', component: HomeComponent },
  { path: 'entrance', component: EntranceComponent },
  { path: 'lobby', component: LobbyComponent },
  { path: 'about', component: AboutComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    EntranceComponent,
    LobbyComponent,
    RoomComponent,
    HomeComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot( link ),
    NgbModule.forRoot()
  ],
  providers: [ VideocenterService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
