import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { VideocenterService } from '../providers/videocenter.service';
import * as xInterface from '../app.interface';
@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent {
  myRoomname: string;
  inputMessage: string;
  constructor( private router: Router,
  private vc: VideocenterService ) {
    this.initialize();
    this.joinRoom();
   }
  /**
  *@desc This method will initialize 
  *the some of the properties of RoomPage
  */
  initialize() {
    this.inputMessage = '';
  }
  /**
  *@desc This method will get roomname then join the roomname
  */
  joinRoom() {
    let room = localStorage.getItem('roomname');
    this.vc.joinRoom( room, (data)=> {
      this.myRoomname = data.room;
    });
  }
  /**
   *@desc This method will Leave the room and go back to lobby
   */
  onClickLobby() {
    this.router.navigate(['lobby']);
  }
}
