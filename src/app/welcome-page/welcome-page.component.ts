import { Component, OnInit } from '@angular/core';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { UserLoginFormComponent } from '../user-login-form/user-login-form.component';
import { MatDialog } from '@angular/material/dialog';
import { MovieCardComponent } from '../movie-card/movie-card.component';

/**
 * The component representing the welcome page of the app.
 */

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

/**
   * Lifecycle hook called after the component has been initialized.
   */

  ngOnInit(): void {
  }

/**
   * Opens the user registration dialog.
   */

  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      width: '480px'
    });
  }

/**
   * Opens the user login dialog.
   */

  openUserLoginDialog(): void {
      this.dialog.open(UserLoginFormComponent, {
        width: '480px'
      });
    }

 /**
   * Opens the movies dialog.
   */

  openMoviesDialog(): void {
    this.dialog.open(MovieCardComponent, {
      width: '200px'
    });
  }
}
