import { TestBed } from '@angular/core/testing';

import { PagarmeService } from './pagarme.service';

describe('PagarmeService', () => {
  let service: PagarmeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PagarmeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
