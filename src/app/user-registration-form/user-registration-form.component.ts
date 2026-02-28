import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss']
})
export class UserRegistrationFormComponent implements OnInit {

  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar,
    public router: Router
  ) { }

  ngOnInit(): void {}

  /**
   * Validates form inputs and registers the user.
   */
  /**
   * Registers a new user and automatically logs them in.
   */
  registerUser(form: NgForm): void {
    if (form.invalid) {
      this.snackBar.open('Please fill out all required fields correctly.', 'OK', {
        duration: 15000,
        panelClass: ['app-snackbar-top']
      });
      return;
    }
  
    this.fetchApiData.userRegistration(this.userData).subscribe(
      (result) => {
        console.log(result);
        // Automatically login the user after successful registration
        this.fetchApiData.userLogin({ Username: this.userData.Username, Password: this.userData.Password }).subscribe(
          (loginResult) => {
            localStorage.setItem('user', JSON.stringify(loginResult.user));
            localStorage.setItem('token', loginResult.token);
            this.dialogRef.close();
            this.snackBar.open('User successfully registered and logged in!', 'OK', {
              duration: 15000,
              panelClass: ['app-snackbar-top']
            });
            // Navigate to movies page
            this.router.navigate(['movies']);
          },
          (loginError) => {
            // If auto-login fails, show success message and close dialog
            this.dialogRef.close();
            this.snackBar.open('User successfully registered. Please log in with your credentials.', 'OK', {
              duration: 15000,
              panelClass: ['app-snackbar-top']
            });
          }
        );
      },
      (error) => {
        // Check the error message or status and display a custom message
        if (error.status === 400 && error.error.includes('duplicate key error')) {
          this.snackBar.open('Username is already taken. Please choose another one.', 'OK', {
            duration: 15000,
            panelClass: ['app-snackbar-top']
          });
        } else {
          this.snackBar.open('User registration failed. Please try changing your username.', 'OK', {
            duration: 15000,
            panelClass: ['app-snackbar-top']
          });
        }
      }
    );
  }  

  goBack(): void {
    this.dialogRef.close();
  }
}
