import { Component, Input } from '@angular/core';
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
      <button class='btn btn-primary' (click)="activeModal.close('Close click'); openVideoSettings();">
        Video Settings <i class="fa fa-video-camera" aria-hidden="true"></i>
      </button>
      <button class='btn btn-success' (click)="activeModal.close('Close click'); openAudioSettings();">
        Audio Settings <i class="fa fa-volume-up" aria-hidden="true"></i>
      </button>
      
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="activeModal.close('Close click')">Close</button>
    </div>
  `
})
export class NgbdModalEntranceMenu {
  @Input() name;

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal ) {
    }
  openAudioSettings() {
    const modalRefAud = this.modalService.open(NgbdModalAudio);
  }
  openVideoSettings() {
    const modalRefVid = this.modalService.open(NgbdModalVideo);
  }
}