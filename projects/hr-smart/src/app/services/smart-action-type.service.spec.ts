import { TestBed } from '@angular/core/testing';

import { SmartActionTypeService } from './smart-action-type.service';

describe('SmartActionTypeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SmartActionTypeService = TestBed.get(SmartActionTypeService);
    expect(service).toBeTruthy();
  });
});
