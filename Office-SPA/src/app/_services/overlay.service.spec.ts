/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { OverlayService } from './overlay.service';

describe('Service: Overlay', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OverlayService]
    });
  });

  it('should ...', inject([OverlayService], (service: OverlayService) => {
    expect(service).toBeTruthy();
  }));
});
