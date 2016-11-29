/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { VideocenterService } from './videocenter.service';

describe('VideocenterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VideocenterService]
    });
  });

  it('should ...', inject([VideocenterService], (service: VideocenterService) => {
    expect(service).toBeTruthy();
  }));
});
