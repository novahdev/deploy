import { Component, effect, input } from '@angular/core';
import { ProjectStatus } from '@deploy/schemas/projects';

@Component({
  selector: 'app-status-project-icon',
  imports: [],
  templateUrl: './status-project-icon.component.html',
  styleUrl: './status-project-icon.component.scss',
  host: {
    class: 'status-project-icon',
    '[class.running]': 'status() === "running"',
    '[class.stopped]': 'status() === "stopped"',
    '[style.width]': 'diameter()',
    '[style.height]': 'diameter()',
  }
})
export class StatusProjectIconComponent {
  status = input<ProjectStatus>("stopped");
  diameter = input<string>("1.2em");

  constructor(){
    effect(() => {  
      console.log(this.status());
    })
  }
}
