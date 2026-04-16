import { TestBed } from '@angular/core/testing';

import { ResponsesSentService } from './responses-sent.service';

describe('ResponsesSentService', () => {
  let service: ResponsesSentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResponsesSentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
