import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as xInterface from './app.interface';
import { VideocenterService } from './providers/videocenter.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  constructor( private vc: VideocenterService , private router: Router) {
    console.log("AppComponent");
    vc.connect();
    this.checkUserAndRoom();
  }
  /**
   * @desc Check if there's a username
   * and check if there is also a roomname
   * then navigate according to the logic
   */  
  checkUserAndRoom() {
    let username = localStorage.getItem('username');
    let roomname = localStorage.getItem('roomname');
    if ( username ) {
      console.log("checkUserAndRoom()", username, roomname);
      if ( roomname && roomname != xInterface.LobbyRoomName ) { // if user has room name, don't go to lobby.
      }
      else {
        console.log('go to lobby');
        this.router.navigate(['lobby']);
      }

      this.vc.updateUsername( username, re => {
          if( roomname && roomname != xInterface.LobbyRoomName ){
              this.router.navigate(['room']);   
          }
      });


    }
    else this.router.navigate(['entrance']);
  }
}
