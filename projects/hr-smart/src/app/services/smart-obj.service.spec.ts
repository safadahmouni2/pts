import { TestBed } from '@angular/core/testing';

import { SmartObjService } from './smart-obj.service';

describe('SmartObjService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SmartObjService = TestBed.get(SmartObjService);
    expect(service).toBeTruthy();
  });
});
