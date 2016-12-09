import { Component, Input } from '@angular/core';
import * as xInterface from '../../app.interface';
import { VideocenterService } from '../../providers/videocenter.service';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'ngbd-modal-audio',
  template: `
    <div class="modal-header">
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
      <h4 class="modal-title">Audio Settings</h4>
    </div>
    <div class="modal-body">
      <div id="device-settings">
          <select [(ngModel)]="vs.selectAudio" (ngModelChange)="onChangeAudio($event)">
              <option *ngFor="let audio of audios" value="{{ audio.value }}" >{{audio.text}}</option>
          </select>
      </div>  
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="activeModal.close('Close click')">Close</button>
    </div>
  `
})
export class NgbdModalAudio {
  @Input() name;
  audios: any = [];
  connection:any;
  vs: xInterface.VideoSetting = xInterface.videoSetting;
  constructor(public activeModal: NgbActiveModal) {
    this.initialize();
    this.showSettings();
  }
  /**
  *@desc This method will invoke the setDefaultDevice Method
  */
  ngOnInit() {
    this.setDefaultDevice();
    
  }
  /**
  *@desc This method will initialize 
  *some of the properties of EntrancePage
  */
  initialize() {
    this.vs.defaultAudio = false;
    this.connection = VideocenterService.connection;
      this.connection.sdpConstraints.mandatory = {
          OfferToReceiveAudio: true,
          OfferToReceiveVideo: true
      };
  }
  /**
  *@desc This method will set the default device to be use
  */
  setDefaultDevice() {
    let audioSourceId = localStorage.getItem('default-audio');
    if ( audioSourceId ) this.onChangeAudio( audioSourceId );
  }
  /**
  *@desc This method will add device for video select and audio select
  */
  showSettings() {
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
    this.connection.mediaConstraints.audio.optional = [{
        sourceId: audioSourceId
    }];
    this.vs.defaultAudio = true;
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