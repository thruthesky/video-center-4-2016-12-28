import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, Router, RouterModule, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { LobbyRoomName } from './app.interface';
import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { EntranceComponent } from './entrance/entrance.component';
import { LobbyComponent } from './lobby/lobby.component';
import { RoomComponent } from './room/room.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';

import { NgbdModalDeviceMenu } from './ngbootstrap/modal/device-menu.component';


import { AutoscrollDirective } from './components/autoscroll/autoscroll';
import { MycanvasDirective } from './components/mycanvas/mycanvas';
import { VideocenterService } from './providers/videocenter.service';

import { FirebaseApiModule } from './firebase-api/firebase-api-module';

import { LogoComponent } from './components/logo/logo';

let link: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'entrance', component: EntranceComponent },
  { path: 'lobby', component: LobbyComponent },
  { path: 'room', component: RoomComponent }
];
let username = localStorage.getItem('username');
let roomname = localStorage.getItem('roomname');
let begin = null;
if ( username ) {
  if ( roomname && roomname != LobbyRoomName ) begin = RoomComponent;
  else begin = LobbyComponent;
}
else begin = EntranceComponent;
link.push( { path: '', component: begin } );
//console.log("links: ", link);



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
    NgbdModalDeviceMenu,
    LogoComponent
  ],
  entryComponents: [
    NgbdModalDeviceMenu
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
