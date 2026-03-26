import { TestBed } from '@angular/core/testing';

import { PublishedFormsService } from './published-forms.service';

describe('PublishedFormsService', () => {
  let service: PublishedFormsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublishedFormsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
