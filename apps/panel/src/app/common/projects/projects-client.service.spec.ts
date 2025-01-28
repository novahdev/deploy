import { TestBed } from '@angular/core/testing';

import { ProjectsClientService } from './projects-client.service';

describe('ProjectsClientService', () => {
  let service: ProjectsClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectsClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
