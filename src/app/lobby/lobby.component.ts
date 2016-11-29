import { Component } from '@angular/core';
import {  Router } from '@angular/router';
import { VideocenterService } from '../providers/videocenter.service';
import * as xInterface from '../app.interface';
@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent {
  myUsername: string;
  inputUsername: string;
  inputMessage: string;
  rooms: xInterface.ROOMS = <xInterface.ROOMS> {};
  listMessage: xInterface.MESSAGELIST = <xInterface.MESSAGELIST> {};
  constructor( private router: Router,
  private vc: VideocenterService ) {
    this.initialize();
    this.joinLobby();
    this.listenEvents();
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
  *@desc Group of View Method
  */

  /**
  *@desc This method will update the username of user
  */
  onUpdateUsername() {
    if ( ! this.inputUsername ) return alert("Your Username input is empty!");
    this.vc.updateUsername(this.inputUsername, ( user: xInterface.USER ) => {
      this.inputUsername = "";
      this.myUsername = user.name;
    });
  }
  /**
  *@desc This method will send the message to the server
  *after that it will empty the message input box
  *@param message 
  */  
  onSendMessage(message: string) {
    if(message != "") this.vc.sendMessage(message, ()=> { 
      this.inputMessage = ''; 
    });
  }
  /**
  *@desc This method will go to entrance page
  *after you logout in the server
  */
  onClickLogout() {
    this.vc.logout(()=> {
      this.router.navigate(['entrance']);
    });    
  }
  /**
  *@desc This method will subscribe to all events
  */
  listenEvents() {
    this.vc.myEvent.subscribe( item => {
      if( item.eventType == "update-username")console.log("update-username:",item); 
      if( item.eventType == "chatMessage") this.addMessage( item );
    });
  }
  /**
   *@desc Groups of onevent Method 
   */ 

  /**
   *@desc Add to listMessage to be displayed in the view
   *@param message 
   */  
  addMessage( message ) {     
    this.listMessage[0].messages.push( message );
    let data = { eventType: "scroll-to-bottom"};
    setTimeout(()=>{ this.vc.myEvent.emit(data); }, 100); 
  }
}
