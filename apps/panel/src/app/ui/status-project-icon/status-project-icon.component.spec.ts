import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusProjectIconComponent } from './status-project-icon.component';

describe('StatusProjectIconComponent', () => {
  let component: StatusProjectIconComponent;
  let fixture: ComponentFixture<StatusProjectIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusProjectIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusProjectIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
