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

import { NgbdModalAudio } from './ngbootstrap/modal/audio.component';
import { NgbdModalEntranceMenu } from './ngbootstrap/modal/entrance-menu.component';


import { AutoscrollDirective } from './components/autoscroll/autoscroll';
import { MycanvasDirective } from './components/mycanvas/mycanvas';
import { VideocenterService } from './providers/videocenter.service';

import { FirebaseApiModule } from './firebase-api/firebase-api-module';


let link: Routes = [
  { path: '', redirectTo: '/entrance', pathMatch: 'full'},
  { path: 'entrance', component: EntranceComponent },
  { path: 'lobby', component: LobbyComponent },
  { path: 'room', component: RoomComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    EntranceComponent,
    LobbyComponent,
    RoomComponent,
    HomeComponent,
    AboutComponent,
    AutoscrollDirective,
    MycanvasDirective,
    NgbdModalEntranceMenu,
    NgbdModalAudio
  ],
  entryComponents: [
    NgbdModalEntranceMenu,
    NgbdModalAudio
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot( link ),
    NgbModule.forRoot(),
    FirebaseApiModule
  ],
  providers: [ VideocenterService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
