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
  vs: xInterface.VideoSetting = xInterface.videoSetting;
  imageUrlPhoto: string; 
  canvasPhoto: string;
  connection:any;
  videos:any =[];
  audios: any = [];
  constructor( private router: Router,
  private vc: VideocenterService ) {
    this.initialize();
    this.joinRoom();
    this.streamOnConnection();
    this.showSettings();
    this.listenEvents();
   }
  /**
  *@desc This method will initialize 
  *the some of the properties of RoomPage
  */
  initialize() {
    let room = localStorage.getItem('roomname');
    if( room == xInterface.LobbyRoomName ) this.router.navigate(['lobby']);
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
  /**
  *@desc This method will invoke the setCanvasSize Method
  */
  ngOnInit() {
    this.setCanvasSize( this.wb.canvasWidth, this.wb.canvasHeight);
    this.setDefaultDevice();
    
  }
  /**
  *@desc This method will set the default device to be use
  */
  setDefaultDevice() {
    let videoSourceId = localStorage.getItem('default-video');
    let audioSourceId = localStorage.getItem('default-audio');
    console.log("videoSourceId:",videoSourceId);
    console.log("audioSourceId:",audioSourceId);
    if ( videoSourceId ) this.onChangeVideo( videoSourceId );
    if ( audioSourceId ) this.onChangeAudio( audioSourceId );
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

  /**
  *@desc This method will check if there is new stream
  *then invoke addUserVideo to add new stream
  */
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
  *@desc This method will add device for video select and audio select
  */
  showSettings() {
    let room = localStorage.getItem('roomname');
     setTimeout(()=>{
       if( room !== xInterface.LobbyRoomName ) {
        this.connection.getUserMedia(()=> {
            this.connection.DetectRTC.load(() => {
            this.connection.DetectRTC.MediaDevices.forEach((device) => {
              this.addVideoOption( device );
              this.addAudioOption( device );
            });
            this.setDefaultAudioSelected();
            this.setDefaultVideoSelected();
          });
        });
       }
    }, 1000);
  }
  /**
  *@desc This method will add video options on video select
  *@param device 
  */
  addVideoOption( device ) {
    if(device.kind.indexOf('video') !== -1) {
      let video = {
        text: device.label || device.id,
        value: device.id
      };
      this.videos.push( video );
    }
  }
  /**
  *@desc This method will add audio options on audio select
  *@param device
  */
  addAudioOption ( device ) {
    if(device.kind === 'audioinput') {
      let audio = {
          text: device.label || device.id,
          value: device.id
        };
      this.audios.push( audio );
    }
  }
  /**
  *@desc This method will set the selected audio from storage
  */
  setDefaultAudioSelected(){
    this.vs.selectAudio = localStorage.getItem('default-audio');
  }
  /**
  *@desc This method will set the selected video from storage
  */
  setDefaultVideoSelected(){
    this.vs.selectVideo = localStorage.getItem('default-video');
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
      localStorage.setItem('roomname', xInterface.LobbyRoomName );
      location.reload();
    });
  }
  /**
   *@desc Group Method for Audio and Video
   */
  /**
   *@desc This method will first check
   *if the userid is others or his/her self
   */
  addUserVideo( event ) {
    if( this.connection.userid == event.userid ) this.addLocalVideo( event ); 
    else this.addRemoteVideo( event ); 
    
  }
  /**
   *@desc This method will add 
   *local video stream
   *@param event
   */
  addLocalVideo( event ) {
    let newvideo = event.mediaElement;
    let videoParent = document.getElementById('video-container');
    let oldVideo = document.getElementById(event.streamid);
    newvideo.setAttribute('class', 'me');
    newvideo.setAttribute('width', xInterface.videoSize );
    if( oldVideo && oldVideo.parentNode) oldVideo.parentNode.removeChild( oldVideo );
    if( videoParent ) videoParent.insertBefore(newvideo, videoParent.firstChild);
  }
  /**
   *@desc This method will add 
   *remote video stream
   *@param event
   */
  addRemoteVideo( event ) {
    setTimeout(()=> {
      let newvideo = event.mediaElement;
      let videoParent = document.getElementById('video-container');
      let oldVideo = document.getElementById(event.streamid);
      newvideo.setAttribute('class', 'others');
      newvideo.setAttribute('width', xInterface.videoSize );
      if( oldVideo && oldVideo.parentNode) oldVideo.parentNode.removeChild( oldVideo );
      if( videoParent ) videoParent.appendChild( newvideo );
    },700);
  }
  /**
  *@desc This method will change video device
  *@param videoSourceId
  */
  onChangeVideo( videoSourceId ) {
    localStorage.setItem('default-video', videoSourceId );
    if(this.videoSelectedAlready( videoSourceId )) return;
    this.removeVideoTrackAndStream();
    this.removeAudioTrackAndStream();
    this.connection.mediaConstraints.video.optional = [{
        sourceId: videoSourceId
    }];
    let video = document.getElementsByClassName('me')[0];
    if(video) {
      video.parentNode.removeChild( video );
      this.connection.captureUserMedia( ()=> {
        this.connection.renegotiate();
      });
    }
  }
  /**
  *@desc This method will check if video is already selected
  *@param videoSourceId
  *@return result 
  */
  videoSelectedAlready( videoSourceId ) {
    let result = 0;
    let videoOptionalLength = this.connection.mediaConstraints.video.optional.length;
    let attachStreamsLength = this.connection.attachStreams.length;
    
    if( videoOptionalLength && attachStreamsLength ) {
      if(this.connection.mediaConstraints.video.optional[0].sourceId === videoSourceId) {
          alert('Selected video device is already selected.');
          result = 1;
      }
    }
    return result;
  }
  /**
  *@desc This method will remove the track and stream of video
  */
  removeVideoTrackAndStream() {
    this.connection.attachStreams.forEach((stream) =>{
      stream.getVideoTracks().forEach((track) =>{
        stream.removeTrack(track);
        if(track.stop)track.stop();
      });
    });
  }

  /**
  *@desc This method will change audio device
  *@param audioSourceId
  */
  onChangeAudio( audioSourceId ) {
    localStorage.setItem('default-audio', audioSourceId );
    if(this.audioSelectedAlready( audioSourceId )) return;
    this.removeAudioTrackAndStream();
    this.removeVideoTrackAndStream();
    this.connection.mediaConstraints.audio.optional = [{
        sourceId: audioSourceId
    }];
    let video = document.getElementsByClassName('me')[0];
    if(video) {
      video.parentNode.removeChild( video );
      this.connection.captureUserMedia( ()=> {
        this.connection.renegotiate();
      });
    }
  }
  /**
  *@desc This method will check if audio is already selected
  *@param audioSourceId
  *@return result 
  */
  audioSelectedAlready( audioSourceId ) {
    let result = 0;
    let attachStreamsLength = this.connection.attachStreams.length;
    let audioOptionalLength = this.connection.mediaConstraints.audio.optional.length;
    if( audioOptionalLength && attachStreamsLength) {
      if(this.connection.mediaConstraints.audio.optional[0].sourceId === audioSourceId) {
          alert('Selected audio device is already selected.');
          result = 1;
      }
    }
    return result;
  }
  /**
  *@desc This method will remove the track and stream of audio
  */
  removeAudioTrackAndStream() {
    this.connection.attachStreams.forEach((stream) =>{
      stream.getAudioTracks().forEach((track) =>{
        stream.removeTrack(track);
        if(track.stop)track.stop();
      });
    });
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
    let random = this.vc.getRandomInt(0,500);
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
