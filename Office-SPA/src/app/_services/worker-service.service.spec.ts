/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WorkerServiceService } from './worker-service.service';

describe('Service: WorkerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkerServiceService]
    });
  });

  it('should ...', inject([WorkerServiceService], (service: WorkerServiceService) => {
    expect(service).toBeTruthy();
  }));
});
