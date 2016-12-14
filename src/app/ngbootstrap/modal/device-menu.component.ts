import { Component } from '@angular/core';
import * as xInterface from '../../app.interface';
import { VideocenterService } from '../../providers/videocenter.service';
import { NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'ngbd-modal-device-menu',
  templateUrl: 'device-menu.component.html',
  styleUrls: ['device-menu.component.scss']
})
export class NgbdModalDeviceMenu {
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
    *some of the properties of DeviceSettings
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
        let session = { audio: false, video: true };
        this.connection.getUserMedia(()=> {
            this.connection.DetectRTC.load(() => {
            this.connection.DetectRTC.MediaDevices.forEach((device) => {
              this.addVideoOption( device );
            });
            this.setDefaultVideoSelected();
            
          });
        }, session);
      }, 1000);
    }
    /**
    *@desc This method will add device for audio select
    */
    showAudioSettings() {
      setTimeout(()=>{
        let session = { audio: true, video: false };
        this.connection.getUserMedia(()=> {
            this.connection.DetectRTC.load(() => {
            this.connection.DetectRTC.MediaDevices.forEach((device) => {
              this.addAudioOption( device );
            });
            this.setDefaultAudioSelected();
          });
        }, session);
      }, 1000);
    }
    /**
    *@desc This method will change audio device
    *@param audioSourceId
    */
    onChangeAudio( audioSourceId ) {
      if ( !audioSourceId ) return;
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
      if ( !videoSourceId ) return;
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
      let video = localStorage.getItem('default-video')
      if(video)this.vs.selectVideo = video;
      else this.vs.selectVideo = '';
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
      let audio = localStorage.getItem('default-audio')
      if(audio)this.vs.selectAudio = audio;
      else this.vs.selectAudio = '';
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