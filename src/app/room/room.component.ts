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
  imageUrlPhoto: string; 
  canvasPhoto: string;
  connection:any;
  constructor( private router: Router,
  private vc: VideocenterService ) {
    this.initialize();
    this.joinRoom();
    this.streamOnConnection();
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
    this.imageUrlPhoto = this.wb.canvasPhoto;
    this.canvasPhoto = this.wb.canvasPhoto;
    this.connection = VideocenterService.connection;
      this.connection.sdpConstraints.mandatory = {
          OfferToReceiveAudio: true,
          OfferToReceiveVideo: true
      };
  }
  ngOnInit() {
    this.setCanvasSize( this.wb.canvasWidth, this.wb.canvasHeight);
  }
  /**
  *@desc This method will get roomname then join the roomname
  */
  joinRoom() {
    let room = localStorage.getItem('roomname');
    this.vc.joinRoom( room, (data)=> {
      this.myRoomname = data.room;
      this.getWhiteboardHistory( data.room );
      this.openOrJoinSession( data.room );
    });
  }
  streamOnConnection() {
    this.connection.onstream = (event) => this.addUserVideo( event ); 
  }
  /**
  *@desc This method will get the whiteboard history of the room
  *@param roomName 
  */
  getWhiteboardHistory( roomName ) {
    let data :any = { room_name : roomName };
    data.command = "history";
    this.vc.whiteboard( data,() => { console.log("get whiteboard history")} );
  }
  /**
  *@desc This method will open or join a session to have a video conference
  *if the roomName is not lobby
  *@param roomName
  */
  openOrJoinSession( roomName ) {
    if( roomName !== xInterface.LobbyRoomName ) {
      this.connection.openOrJoin( roomName, (roomExist) => {
        if(roomExist)console.log("I Join the Room");
        else console.log("I Open the Room");
        this.connection.socket.on( this.connection.socketCustomEvent, message => { } );
        this.connection.socket.emit( this.connection.socketCustomEvent, this.connection.userid);
      });
    }
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
    this.vc.leaveRoom( ()=> {
      // this.router.navigate(['lobby']);
      localStorage.setItem('roomname', xInterface.LobbyRoomName );
      location.reload();
    });
  }
  /**
   *@desc This method will add video when there's a new stream
   */
  addUserVideo( event ) {
    let me: string = 'others';
    let video = event.mediaElement;
    let videos= document.getElementById('video-container');
    if ( this.connection.userid == event.userid ) me = 'me';
    video.setAttribute('class', me);
    video.setAttribute('width', xInterface.videoSize );
    if ( me == 'me' ) videos.insertBefore(video, videos.firstChild);
    else videos.appendChild( video );
    console.log('connection:',this.connection);
  }
  /**
  *@desc This method will change the canvasPhoto to imageUrlPhoto
  */
  onClickPreviewPhoto() {
    this.canvasPhoto = this.imageUrlPhoto;
  }
  /**
  *@desc This method will set the dataPhoto for upload
  *then upload it
  *@param event
  */
  onChangeFile( event ) {
    console.log( event );
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
   *@param width
   *@param height
   */
  setCanvasSize( width, height ) {
     let mycanvas= document.getElementById('mycanvas');
     mycanvas.setAttribute('width', width);
     mycanvas.setAttribute('height', height);
  }
  /**
  *@desc This method will subscribe to all events
  */
  listenEvents() {
    this.vc.myEvent.subscribe( item => {
      if( item.eventType == "join-room") this.onJoinRoomEvent( item );
      if( item.eventType == "chatMessage") this.addMessage( item );
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
    this.reloadPage(); 
  }
  reloadPage() {
    let random = this.vc.getRandomInt(0,100);
    setTimeout( ()=> { location.reload(); }, random);
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
