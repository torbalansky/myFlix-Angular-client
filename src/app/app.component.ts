import { Component } from '@angular/core';
import { Router } from '@angular/router';

/**
 * The root component of the Angular app.
 */

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'myflix-Angular-client';

  constructor(private router: Router) {}

  isWelcomePage(): boolean {
    return this.router.url === '/' || this.router.url.includes('welcome');
  }
}
