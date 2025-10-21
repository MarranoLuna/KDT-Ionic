import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { kdtGuard } from './kdt-guard';

describe('kdtGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => kdtGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
