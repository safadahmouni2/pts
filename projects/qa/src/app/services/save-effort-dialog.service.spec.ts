import { TestBed } from '@angular/core/testing';

import { SaveEffortDialogService } from './save-effort-dialog.service';

describe('SaveEffortDialogService', () => {
  let service: SaveEffortDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaveEffortDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
