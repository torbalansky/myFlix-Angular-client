import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  /**
   * Navigates to the movies page.
   * Redirects the user to the movies view.
   */

  toMovies(): void {
    this.router.navigate(['movies']);
  }

  /**
   * Navigates to the user profile page.
   * Redirects the user to their profile view.
   */

  toProfile(): void {
    this.router.navigate(['profile']);
  }

  /**
   * Logs out the user.
   * Clears the local storage and redirects to the welcome page.
   */
  
  logOut(): void {
    this.router.navigate(['welcome']);
    localStorage.clear();
  }
}