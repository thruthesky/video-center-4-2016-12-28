import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { VideocenterService } from '../providers/videocenter.service';
import * as xInterface from '../app.interface';
@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent {
  myRoomname: string;
  inputMessage: string;
  listMessage: xInterface.MESSAGELIST = <xInterface.MESSAGELIST> {};
  wb: xInterface.WhiteboardSetting = xInterface.whiteboardSetting; 
  constructor( private router: Router,
  private vc: VideocenterService ) {
    this.initialize();
    this.joinRoom();
    this.listenEvents();
   }
  /**
  *@desc This method will initialize 
  *the some of the properties of RoomPage
  */
  initialize() {
    this.inputMessage = '';
    if ( this.listMessage[0] === void 0 ) this.listMessage[0] = { messages: [] };
    this.wb.selectDrawSize = this.wb.size[0].value;
    this.wb.selectDrawColor = this.wb.colors[0].value;
  }
  ngOnInit() {
    this.setCanvasSize('340px', '500px');
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
  *@desc Group of View Method
  */

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
  *@desc This method will Leave the room and go back to lobby
  */
  onClickLobby() {
    this.router.navigate(['lobby']);
  }
  /**
   * @desc Group for Whiteboard Functionality
   */

  /**
   *@desc This method clear the canvas
   */
  onClickClear() {
    let data = { eventType: "click-clear-canvas"};
    this.vc.myEvent.emit(data);
  } 
  /**
   *@desc This method will change the optionDrawMode to l - line
   */
  onClickDrawMode() {
    this.wb.optionDrawMode = "l";
  } 
  /**
   *@desc This method will change the optionDrawMode to e - erase
   */
  onClickEraseMode() {
    this.wb.optionDrawMode = "e";
  }
  /**
   *@desc This method will set the canvas size
   *@param height
   *@param width
   */
  setCanvasSize( height, width ) {
     let mycanvas= document.getElementById('mycanvas');
     mycanvas.setAttribute('height', height);
     mycanvas.setAttribute('width', width);
  }
  /**
  *@desc This method will subscribe to all events
  */
  listenEvents() {
    this.vc.myEvent.subscribe( item => {
      // if( item.eventType == "update-username")this.updateUserOnUserList( item );
      if( item.eventType == "join-room") this.onJoinRoomEvent( item );
      // if( item.eventType == "leave-room") this.onLeaveRoomEvent( item );
      if( item.eventType == "chatMessage") this.addMessage( item );
      // if( item.eventType == "log-out") this.removeUserList( item );
      if( item.eventType == "disconnect") this.onDisconnectEvent( item );
    });
  }
  /**
  *@desc Groups of onevent Method 
  */

  /**
  *@desc This method will invoke all the methods
  *that will be use after receiving the join room
  *@param data
  */
  onJoinRoomEvent( data ) {  
    this.joinMessage( data ); 
  }
  /**
   *@desc Add to listMessage to be displayed in the view
   *@param message 
   */  
  addMessage( message ) {
    this.listMessage[0].messages.push( message );
    let data = { eventType: "scroll-to-bottom"};
    setTimeout(()=>{ this.vc.myEvent.emit(data); }, 100); 
  }
  /**
  *@desc This method will invoke all the methods
  *that will be use after receiving the disconnect
  *@param data
  */
  onDisconnectEvent( data ) {  
    this.disconnectMessage( data ); 
  }
  /**
   *@desc This method will create a join message variable that
   *will be pass in addMessage
   *@param data 
   */  
  joinMessage( data ){
    let message = { name: data.name, message: ' joins into ' + data.room };
    this.addMessage( message ); 
  }
  /**
   *@desc This method will create a disconnect message variable that
   *will be pass in addMessage
   *@param data 
   */ 
  disconnectMessage( data ){
    if( data.room ){
      let message = { name: data.name, message: ' disconnect into ' + data.room };
      this.addMessage( message );
    } 
  }
}
