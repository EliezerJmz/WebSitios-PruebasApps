import { TestBed } from '@angular/core/testing';

import { FormATSService } from './form-ats.service';

describe('FormATSService', () => {
  let service: FormATSService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormATSService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
