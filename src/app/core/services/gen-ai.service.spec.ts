import { TestBed } from '@angular/core/testing';

import { GenAIService } from './gen-ai.service';

describe('GenAIService', () => {
  let service: GenAIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenAIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
