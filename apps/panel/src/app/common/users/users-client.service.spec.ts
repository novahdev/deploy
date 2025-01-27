import { TestBed } from '@angular/core/testing';

import { UsersClientService } from './users-client.service';

describe('UsersClientService', () => {
  let service: UsersClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
