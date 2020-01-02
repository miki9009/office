/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TimesheetsService } from './timesheets.service';

describe('Service: Timesheets', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimesheetsService]
    });
  });

  it('should ...', inject([TimesheetsService], (service: TimesheetsService) => {
    expect(service).toBeTruthy();
  }));
});
