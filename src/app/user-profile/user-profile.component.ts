import { Component, OnInit, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

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
    private router: Router,
    private dialog: MatDialog
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
    this.fetchApiData.deleteUser().subscribe(() => {
      localStorage.clear(); // Clear local storage upon successful deletion
      this.router.navigate(['/welcome']); // Navigate to the welcome page
      this.snackBar.open('User successfully deleted', 'OK', {
        duration: 2000
      });
    }, (error) => {
      this.snackBar.open(error, 'OK', {
        duration: 2000
      });
    });
  }

  removeFavoriteMovie(movieId: string): void {
    this.fetchApiData.deleteFavoriteMovie(movieId).subscribe(() => {
      // Update the favoriteMovies array by removing the deleted movie
      this.favoriteMovies = this.favoriteMovies.filter(movie => movie._id !== movieId);
      this.snackBar.open('Movie removed from favorites', 'OK', {
        duration: 2000
      });
    }, (error) => {
      console.error(error);
      this.snackBar.open('Failed to remove movie from favorites', 'OK', {
        duration: 2000
      });
    });
  }
  
}  