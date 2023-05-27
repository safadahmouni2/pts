import { TestBed } from '@angular/core/testing';

import { SmartObjectService } from './SO.service';

describe('SmartObjectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SmartObjectService = TestBed.get(SmartObjectService);
    expect(service).toBeTruthy();
  });
});
