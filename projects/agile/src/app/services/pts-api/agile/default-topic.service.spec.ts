import { TestBed } from '@angular/core/testing';

import { DefaultTopicService } from './default-topic.service';

describe('DefaultTopicService', () => {
  let service: DefaultTopicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DefaultTopicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
