import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as xInterface from '../app.interface';
import { VideocenterService } from '../providers/videocenter.service';
@Component({
  selector: 'app-entrance',
  templateUrl: './entrance.component.html',
  styleUrls: ['./entrance.component.scss']
})
export class EntranceComponent {
  username:string;

  videos:any =[];
  audios: any = [];
  connection:any;
  vs: xInterface.VideoSetting = xInterface.videoSetting;
  constructor( 
    private router: Router,
    private vc: VideocenterService ) {
      this.initialize();
      this.joinRoom();
      this.streamOnConnection();
      this.showSettings();
  }
  /**
  *@desc This method will invoke the setDefaultDevice Method
  */
  ngOnInit() {
    this.setDefaultDevice();
    
  }
  /**
  *@desc This method will set the default device to be use
  */
  setDefaultDevice() {
    let videoSourceId = localStorage.getItem('default-video');
    let audioSourceId = localStorage.getItem('default-audio');
    if ( videoSourceId ) this.onChangeVideo( videoSourceId );
    if ( audioSourceId ) this.onChangeAudio( audioSourceId );
  }
  /**
  *@desc This method will update the username 
  *then navigate the router to lobby
  */
  onClickSignin() {
    if ( ! this.username ) return alert("Your Username input is empty!");
    this.vc.updateUsername(this.username, () => {
      this.router.navigate(['lobby']);
    });
  }

  /**
  *@desc Groups of Device Method
  */

  /**
  *@desc This method will initialize 
  *some of the properties of EntrancePage
  */
  initialize() {
    this.connection = VideocenterService.connection;
      this.connection.sdpConstraints.mandatory = {
          OfferToReceiveAudio: true,
          OfferToReceiveVideo: true
      };
  }
  joinRoom() {
    let randomRoom= Math.random().toString(36).substr(2, 5);
    this.openOrJoinSession( randomRoom );
  }
  
  /**
  *@desc This method will add device for video select and audio select
  */
  showSettings() {
    setTimeout(()=>{
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
  *@desc This method will get the selected audio from storage
  */
  setDefaultAudioSelected(){
    this.vs.selectAudio = localStorage.getItem('default-audio');
  }
  /**
  *@desc This method will get the selected video from storage
  */
  setDefaultVideoSelected(){
    this.vs.selectVideo = localStorage.getItem('default-video');
  }
  /**
  *@desc This method will check if there is new stream
  *then invoke addUserVideo to add new stream
  */
  streamOnConnection() {
    this.connection.onstream = (event) => this.addUserVideo( event ); 
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
    setTimeout(()=> {
      let newvideo = event.mediaElement;
      let videoParent = document.getElementById('video-container');
      let oldVideo = document.getElementById(event.streamid);
      newvideo.setAttribute('class', 'me');
      newvideo.setAttribute('width', xInterface.videoSize );
      if( oldVideo && oldVideo.parentNode) oldVideo.parentNode.removeChild( oldVideo );
      if( videoParent ) videoParent.insertBefore(newvideo, videoParent.firstChild);
    },700);
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
    this.connection.mediaConstraints.video.optional = [{
        sourceId: videoSourceId
    }];
    let video = document.getElementsByClassName('me')[0];
    if(video) {
      video.parentNode.removeChild( video );
      this.connection.captureUserMedia();
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
    this.connection.mediaConstraints.audio.optional = [{
        sourceId: audioSourceId
    }];
    let video = document.getElementsByClassName('me')[0];
    if(video) {
      video.parentNode.removeChild( video )
      this.connection.captureUserMedia();
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
}
