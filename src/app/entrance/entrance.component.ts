import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import * as xInterface from '../app.interface';
import { VideocenterService } from '../providers/videocenter.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalDeviceMenu } from '../ngbootstrap/modal/device-menu.component';
@Component({
  selector: 'app-entrance',
  templateUrl: './entrance.component.html',
  styleUrls: ['./entrance.component.scss']
})
export class EntranceComponent {
  username:string;
  vs: xInterface.VideoSetting = xInterface.videoSetting;
  constructor( 
    private router: Router,
    private vc: VideocenterService,
    private modalService: NgbModal ) {
      this.validate();
  }
 /**
  *@desc This method will validate if there is username
  */
  validate() {
    let username = localStorage.getItem('username');
    let roomname = localStorage.getItem('roomname');
    if( username ) {
      if ( roomname == xInterface.LobbyRoomName ) {
        this.router.navigate(['lobby']); 
      }
      this.vc.updateUsername( username, re => {
          if ( roomname && roomname != xInterface.LobbyRoomName ) { 
            this.router.navigate(['room']);   
          }
      });
    } 
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
  *@desc This method will show a menu modal
  */
  onClickMenu() {
    const modalRef = this.modalService.open(NgbdModalDeviceMenu);
  }
  /**
  *@desc This method will show a menu modal with video settings
  */
  onClickVideo() {
    this.onClickMenu();
    let data = { eventType: "show-video-settings"};
    setTimeout(()=>{ this.vc.myEvent.emit(data); }, 100); 
  }
  /**
  *@desc This method will show a menu modal with audio settings
  */
  onClickAudio() {
    this.onClickMenu();
    let data = { eventType: "show-audio-settings"};
    setTimeout(()=>{ this.vc.myEvent.emit(data); }, 100); 
  }
}
