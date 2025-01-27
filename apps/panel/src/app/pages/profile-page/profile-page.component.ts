import { Component } from '@angular/core';
import { ProfileInfoComponent } from '@deploy/panel/ui/profile-info/profile-info.component';
import { ProfileSecurityComponent } from '@deploy/panel/ui/profile-security/profile-security.component';

@Component({
  selector: 'app-profile-page',
  imports: [
    ProfileInfoComponent,
    ProfileSecurityComponent
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent {

}
