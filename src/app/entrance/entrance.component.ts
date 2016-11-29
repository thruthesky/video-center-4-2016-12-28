import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { VideocenterService } from '../providers/videocenter.service';
@Component({
  selector: 'app-entrance',
  templateUrl: './entrance.component.html',
  styleUrls: ['./entrance.component.scss']
})
export class EntranceComponent {
  username:string;
  constructor( 
    private router: Router,
    private vc: VideocenterService ) {
  }
  onClickSignin() {
    if ( ! this.username ) return alert("Your Username input is empty!");
    this.vc.updateUsername(this.username, () => {
      this.router.navigate(['lobby']);
    });
  }
}
