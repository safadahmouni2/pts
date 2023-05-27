import { TestBed } from '@angular/core/testing';

import { PrivateGuardService } from './private-guard.service';

describe('PrivateGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PrivateGuardService = TestBed.inject(PrivateGuardService);
    expect(service).toBeTruthy();
  });
});
