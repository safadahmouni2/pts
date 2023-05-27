import { TestBed } from '@angular/core/testing';

import { UserLoggedService } from './user-logged.service';

describe('UserLoggedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserLoggedService = TestBed.get(UserLoggedService);
    expect(service).toBeTruthy();
  });
});
