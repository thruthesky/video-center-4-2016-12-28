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
}
