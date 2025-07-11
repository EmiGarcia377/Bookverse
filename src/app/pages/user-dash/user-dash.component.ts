import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-dash',
  imports: [ RouterLink ],
  templateUrl: './user-dash.component.html',
  styles: ``
})
export class UserDashComponent {
  error: string = '';
  message: string = '';

}
