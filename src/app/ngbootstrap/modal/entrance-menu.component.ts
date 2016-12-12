import { Component } from '@angular/core';
import * as xInterface from '../../app.interface';
import { VideocenterService } from '../../providers/videocenter.service';
import { NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalAudio } from './audio.component';
import { NgbdModalVideo } from './video.component';

@Component({
  selector: 'ngbd-modal-entrance-menu',
  template: `
    <div class="modal-header">
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
      <h4 class="modal-title">Entrance Menu</h4>
    </div>
    <div class="modal-body">
      <button class='btn btn-primary' (click)="onClickVideo(); ">
        Video Settings <i class="fa fa-video-camera" aria-hidden="true"></i>
      </button>
      <button class='btn btn-success' (click)="onClickAudio(); ">
        Audio Settings <i class="fa fa-volume-up" aria-hidden="true"></i>
      </button>
      
      <div *ngIf=" displayVideo">
        <h4 class="modal-title">Video Settings</h4>
        <div id="device-video-settings">
          <select [(ngModel)]="vs.selectVideo" (ngModelChange)="onChangeVideo($event)">
              <option *ngFor="let video of videos" value="{{ video.value }}" >{{video.text}}</option>
          </select>
          <div id="video-modal-container"></div> 
        </div>  
      </div>
      <div *ngIf=" displayAudio">
        <h4 class="modal-title">Audio Settings</h4>
        <div id="device-audio-settings">
          <select [(ngModel)]="vs.selectAudio" (ngModelChange)="onChangeAudio($event)">
              <option *ngFor="let audio of audios" value="{{ audio.value }}" >{{audio.text}}</option>
          </select>
        </div>  
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="activeModal.close('Close click')">Close</button>
    </div>
  `
})
export class NgbdModalEntranceMenu {
  displayAudio: boolean = false;
  displayVideo: boolean = false;
  videos: any = [];
  audios: any = [];
  connection:any;
  vs: xInterface.VideoSetting = xInterface.videoSetting;
  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal ) {
      this.initialize();
    }
  
    /**
    *@desc This method will invoke the removeStream Method
    */
    ngOnDestroy() {
      this.removeStream();
      this.removeVideosAudios();
    }
    /**
    *@desc This method will invoke the
    * removeAudioTrackAndStream and removeVideoTrackAndStream Method
    */
    removeStream() {
      this.removeAudioTrackAndStream();
      this.removeVideoTrackAndStream();
    }
    /**
    *@desc This method will empty the videos and audios array
    */  
    removeVideosAudios() {
      this.videos = [];
      this.audios = [];
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
    /**
    *@desc This method will show the video settings
    *by invokings the showVideoSettings
    */
    onClickVideo() {
      this.removeStream();
      this.removeVideosAudios();
      let videoSourceId = localStorage.getItem('default-video');
      if ( videoSourceId ) this.onChangeVideo( videoSourceId );
      this.displayVideo =! this.displayVideo; 
      this.displayAudio = false;
      this.showVideoSettings();
      this.streamOnVideoConnection();
    }
    /**
    *@desc This method will show the audio settings
    *by invokings the showAudioSettings
    */
    onClickAudio() {
      this.removeStream();
      this.removeVideosAudios();
      let audioSourceId = localStorage.getItem('default-audio');
      if ( audioSourceId ) this.onChangeAudio( audioSourceId );
      this.displayAudio =! this.displayAudio; 
      this.displayVideo = false;
      this.showAudioSettings();
      this.streamOnAudioConnection();
    }
    

    /**
    *@desc This method will add device for video select
    */
    showVideoSettings() {
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
    *@desc This method will add device for audio select
    */
    showAudioSettings() {
      setTimeout(()=>{
        this.connection.getUserMedia(()=> {
            this.connection.DetectRTC.load(() => {
            this.connection.DetectRTC.MediaDevices.forEach((device) => {
              this.addAudioOption( device );
            });
            this.setDefaultAudioSelected();
          });
        });
      }, 1000);
    }
    /**
    *@desc This method will change audio device
    *@param audioSourceId
    */
    onChangeAudio( audioSourceId ) {
      if( this.vs.defaultAudio ) if(this.audioSelectedAlready( audioSourceId )) return;
      localStorage.setItem('default-audio', audioSourceId );
      this.removeAudioTrackAndStream();
      this.removeVideoTrackAndStream();
      this.connection.mediaConstraints.audio.optional = [{
          sourceId: audioSourceId
      }];
      this.connection.captureUserMedia();
      this.vs.defaultAudio = true;
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
            result = 1;
        }
      }
      return result;
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
            result = 1;
        }
      }
      return result;
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
    *@desc This method will check if there is new stream
    *then invoke addUserVideo to add new stream
    */
    streamOnVideoConnection() {
      this.connection.onstream = (event) => this.addUserVideo( event ); 
    }
    /**
    *@desc This method will check if there is new stream
    *then return it
    */
    streamOnAudioConnection() {
      this.connection.onstream = (event) => {};
    }
    /**
    *@desc This method will first check
    *if the userid is others or his/her self
    */
    addUserVideo( event ) {
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