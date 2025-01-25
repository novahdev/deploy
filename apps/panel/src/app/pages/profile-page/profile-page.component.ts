import { Component } from '@angular/core';
import { ProfileInfoComponent } from '@deploy/panel/ui/profile-info/profile-info.component';

@Component({
  selector: 'app-profile-page',
  imports: [
    ProfileInfoComponent
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent {

}
