import { TestBed } from '@angular/core/testing';

import { FetchApiDataService } from './fetch-api-data.service';

describe('FetchApiDataService', () => {
  let service: FetchApiDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchApiDataService);
  });

  /**
   * Test case to check if the FetchApiDataService is created.
   * It verifies that the service instance is truthy.
   */

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
