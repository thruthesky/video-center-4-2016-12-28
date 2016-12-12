import { Component, Input } from '@angular/core';
import * as xInterface from '../../app.interface';
import { VideocenterService } from '../../providers/videocenter.service';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'ngbd-modal-audio',
  template: `
    <div class="modal-header">
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click');">
        <span aria-hidden="true">&times;</span>
      </button>
      <h4 class="modal-title">Video Settings</h4>
    </div>
    <div class="modal-body">
    
      <div id="device-settings">
        <select [(ngModel)]="vs.selectVideo" (ngModelChange)="onChangeVideo($event)">
            <option *ngFor="let video of videos" value="{{ video.value }}" >{{video.text}}</option>
        </select>
    </div>
    <div id="video-modal-container"></div> 
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="activeModal.close('Close click'); ">Close</button>
    </div>
  `
})
export class NgbdModalVideo {
  @Input() name;
  videos: any = [];
  connection:any;
  vs: xInterface.VideoSetting = xInterface.videoSetting;
  constructor(public activeModal: NgbActiveModal) {
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
  *@desc This method will invoke the removeStream Method
  */
  ngOnDestroy() {
    this.removeStream();
  }
  
  /**
  *@desc This method will initialize 
  *some of the properties of EntrancePage
  */
  initialize() {
    this.vs.defaultVideo = false;
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
        this.connection.socket.on( this.connection.socketCustomEvent, message => { } );
        this.connection.socket.emit( this.connection.socketCustomEvent, this.connection.userid);
      });
    }
  }

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
      if(newvideo.tagName == "AUDIO" ) return;
      let videoParent = document.getElementById('video-modal-container');
      let oldVideo = document.getElementById(event.streamid);
      newvideo.setAttribute('class', 'me');
      newvideo.setAttribute('width', xInterface.videoSize );
      if( oldVideo && oldVideo.parentNode) oldVideo.parentNode.removeChild( oldVideo );
      if( videoParent ) videoParent.insertBefore(newvideo, videoParent.firstChild);
    },1000);
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
    },1000);
  }
  /**
  *@desc This method will set the default device to be use
  */
  setDefaultDevice() {
    let videoSourceId = localStorage.getItem('default-video');
    if ( videoSourceId ) this.onChangeVideo( videoSourceId );
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
          });
          this.setDefaultVideoSelected();
          
        });
      });
    }, 1000);
  }
  /**
  *@desc This method will change video device
  *@param videoSourceId
  */
  onChangeVideo( videoSourceId ) {
    if( this.vs.defaultVideo )  if(this.videoSelectedAlready( videoSourceId )) return;
    localStorage.setItem('default-video', videoSourceId );
    this.removeAudioTrackAndStream();
    this.removeVideoTrackAndStream();
    
    this.connection.mediaConstraints.video.optional = [{
        sourceId: videoSourceId
    }];
    let video = document.getElementsByClassName('me')[0];
    if(video) {
      video.parentNode.removeChild( video );
      this.connection.captureUserMedia();
    }
    this.vs.defaultVideo = true;
  }
  /**
  *@desc This method will remove video device stream
  */
  removeStream() {
    this.removeAudioTrackAndStream();
    this.removeVideoTrackAndStream();
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
  *@desc This method will get the selected video from storage
  */
  setDefaultVideoSelected(){
    this.vs.selectVideo = localStorage.getItem('default-video');
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