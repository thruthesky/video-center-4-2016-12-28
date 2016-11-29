import { Component } from '@angular/core';
import { VideocenterService } from './providers/videocenter.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  constructor( private vc: VideocenterService ) {
    vc.connect();
  }
}
