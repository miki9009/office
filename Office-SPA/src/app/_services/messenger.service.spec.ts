/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MessengerService } from './messenger.service';

describe('Service: Messenger', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessengerService]
    });
  });

  it('should ...', inject([MessengerService], (service: MessengerService) => {
    expect(service).toBeTruthy();
  }));
});
