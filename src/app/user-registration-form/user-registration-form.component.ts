import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    public snackBar: MatSnackBar) { }

  ngOnInit(): void {}

  /**
   * Validates form inputs and registers the user.
   */
  registerUser(form: NgForm): void {
    if (form.invalid) {
      this.snackBar.open('Please fill out all required fields correctly.', 'OK', {
        duration: 3000
      });
      return;
    }

    this.fetchApiData.userRegistration(this.userData).subscribe((result) => {
      console.log(result);
      this.dialogRef.close();
      this.snackBar.open('User successfully registered', 'OK', {
        duration: 2000
      });
    }, (error) => {
      console.log(error);
      this.snackBar.open('User registration failed', 'OK', {
        duration: 2000
      });
    });
  }

  goBack(): void {
    this.dialogRef.close();
  }
}
