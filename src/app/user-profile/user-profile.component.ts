import { Component, OnInit, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  user: any = {};
  movies: any[] = [];
  favoriteMovies: any[] = [];

  @Input() userDetails = { Username: '', Password: '', Email: '', Birthday: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    this.fetchApiData.getOneUser().subscribe((response: any) => {
      this.user = response;
      this.userDetails.Username = this.user.Username;
      this.userDetails.Email = this.user.Email;
      this.userDetails.Birthday = formatDate(
        this.user.Birthday,
        'yyyy-MM-dd',
        'en-US',
        'UTC+0'
      );
  
      this.fetchApiData.getAllMovies().subscribe((resp: any) => {
        this.favoriteMovies = resp.filter(
          (m: { _id: any }) => this.user.FavoriteMovies.indexOf(m._id) >= 0
        );
      });
    });
  }  

  editUser(): void {
    const updatedUser = {
      Username: this.userDetails.Username,
      Password: this.userDetails.Password,
      Email: this.userDetails.Email,
      Birthday: this.userDetails.Birthday
    };
  
    this.fetchApiData.editUser(updatedUser).subscribe((result) => {
      localStorage.setItem('user', JSON.stringify(result));
  
      this.snackBar.open('User successfully updated', 'OK', {
        duration: 2000
      });
    }, (result) => {
      this.snackBar.open(result, 'OK', {
        duration: 2000
      });
    });
  } 

  deleteUser(): void {
    this.fetchApiData.deleteUser().subscribe(
      (response) => {
        if (response.success) {
          localStorage.clear();
          this.router.navigate(['welcome']);
          this.snackBar.open('User successfully deleted', 'OK', {
            duration: 2000,
          });
        } else {
          const errorMessage = response.message || 'An error occurred';
          this.snackBar.open(errorMessage, 'OK', {
            duration: 2000,
          });
        }
      },
      (error) => {
        const errorMessage = error?.error?.message || 'An error occurred';
        this.snackBar.open(errorMessage, 'OK', {
          duration: 2000,
        });
      }
    );
  }  
  
}  