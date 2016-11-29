import { Component } from '@angular/core';
import { VideocenterService } from '../providers/videocenter.service';
import * as xInterface from '../app.interface';
@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent {
  myUsername: string;
  inputMessage: string;
  rooms: xInterface.ROOMS = <xInterface.ROOMS> {};
  listMessage: xInterface.MESSAGELIST = <xInterface.MESSAGELIST> {};
  constructor( private vc: VideocenterService ) {
    this.initialize();
    this.joinLobby();
  }
  /**
  *@desc This method will initialize the roompage
  */
  initialize() {
    this.inputMessage = '';
    if ( this.listMessage[0] === void 0 ) this.listMessage[0] = { messages: [] };
  }
  /**
  *@desc This method will join the lobby then
  *will get the username and get all user in roomlist
  */
  joinLobby() {
    this.vc.joinRoom( xInterface.LobbyRoomName, ( room: string ) => {
      this.myUsername = localStorage.getItem('username');
      this.getUserList();
    });
  }
  /**
  *@desc This method will get all the room list and user list
  *and pass it to showRoomList
  */
  getUserList() {
    this.vc.getUserList( '', ( users: { (key: string) : Array<xInterface.USER> } ) => {
      this.showRoomList( users );
    });
  }
  /**
  *@desc This method will loop through all the users and
  *and display it
  *@param re
  */
  showRoomList( users: { (key: string) : Array<xInterface.USER> } ) {
    console.log("showRoomList()",users)
  }
  /**
  *@desc This method will subscribe to all events
  */
  listenEvents() {
    this.vc.myEvent.subscribe( item => {
      if( item.eventType == "update-username")console.log("update-username:",item); 
    });
  }
}
