import { TestBed } from '@angular/core/testing';

import { PropositionService } from './proposition.service';

describe('PropositionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PropositionService = TestBed.get(PropositionService);
    expect(service).toBeTruthy();
  });
});
