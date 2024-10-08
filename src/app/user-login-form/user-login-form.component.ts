import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss']
})
export class UserLoginFormComponent implements OnInit {

  @Input() loginData = { Username: '', Password: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    public router: Router) { }

  ngOnInit(): void {}

  /**
   * Logs in the user by making an API call to authenticate the credentials.
   * If successful, stores the user details and token in the local storage,
   * closes the dialog, displays a success message, and navigates to the movies page.
   * If unsuccessful, displays an error message.
   */
  loginUser(form: NgForm): void {
    if (form.invalid) {
      this.snackBar.open('Please enter both username and password.', 'OK', {
        duration: 3000
      });
      return;
    }

    this.fetchApiData.userLogin(this.loginData).subscribe(
      (result) => {
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('token', result.token);
        this.dialogRef.close();
        this.snackBar.open('Logged in successfully', 'OK', {
          duration: 2000
        });
        this.router.navigate(['movies']);
      },
      (error) => {
        this.snackBar.open('Invalid username or password. Please try again.', 'OK', {
          duration: 3000
        });
      }
    );
  }

  goBack(): void {
    this.dialogRef.close();
  }
}
