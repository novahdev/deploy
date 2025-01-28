import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsUsersWithAccessComponent } from './projects-users-with-access.component';

describe('ProjectsUsersWithAccessComponent', () => {
  let component: ProjectsUsersWithAccessComponent;
  let fixture: ComponentFixture<ProjectsUsersWithAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsUsersWithAccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsUsersWithAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
