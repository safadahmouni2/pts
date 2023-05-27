import { TestBed } from '@angular/core/testing';

import { SourceSystemService } from './source-system-service.';

describe('SourceSystemServiceService', () => {
  let service: SourceSystemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SourceSystemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
