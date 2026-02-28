import { Component, OnInit, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MovieInfoComponent } from '../movie-info/movie-info.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  user: any = {};
  movies: any[] = [];
  favoriteMovies: any[] = [];
  hidePassword: boolean = true;

  @Input() userDetails = { Username: '', Password: '', Email: '', Birthday: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog
  ) { }

  /**
   * Navigate back to movies (home) view.
   */
  goHome(): void {
    this.router.navigate(['movies']);
  }

  ngOnInit(): void {
    // Load user data from local storage first
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      this.userDetails.Username = this.user.Username;
      this.userDetails.Email = this.user.Email;
      this.userDetails.Birthday = formatDate(
        this.user.Birthday,
        'yyyy-MM-dd',
        'en-US',
        'UTC+0'
      );
      // Fetch favorite movies
      this.fetchFavoriteMovies();
    } else {
      // Fetch from the API if not found in local storage
      this.getUser();
    }
  }

  /**
   * Retrieves the user data from the API.
   * Populates the user details and favorite movies.
   */
  getUser(): void {
    this.fetchApiData.getOneUser().subscribe((response: any) => {
      this.user = response;
      this.userDetails.Username = this.user.Username;
    //this.userDetails.Password = this.user.Password;
      this.userDetails.Email = this.user.Email;
      this.userDetails.Birthday = formatDate(
        this.user.Birthday,
        'yyyy-MM-dd',
        'en-US',
        'UTC+0'
      );

      // Save the fetched user data to local storage
      localStorage.setItem('user', JSON.stringify(this.user));

      // Fetch favorite movies after fetching user
      this.fetchFavoriteMovies();
    });
  }

  /**
   * Fetches the user's favorite movies from the API.
   */
  fetchFavoriteMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      // Filter favorite movies based on user data
      this.favoriteMovies = resp.filter((m: { _id: any }) => this.user.FavoriteMovies.indexOf(m._id) >= 0);
      console.log('Favorite Movies:', this.favoriteMovies);
    });
  }

  /**
   * Updates the user details.
   * Makes a request to the API to update the user data.
   * Shows a snackbar message upon success or failure.
   */
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
        duration: 15000,
        panelClass: ['app-snackbar-top']
      });
  
      this.userDetails.Username = result.Username;
      this.userDetails.Email = result.Email;
   // this.userDetails.Password = result.Password;
      this.userDetails.Birthday = formatDate(result.Birthday, 'yyyy-MM-dd', 'en-US', 'UTC+0');
  
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }, (result) => {
      this.snackBar.open(result, 'OK', {
        duration: 15000,
        panelClass: ['app-snackbar-top']
      });
    });
  }  

  /**
   * Deletes the user account.
   * Makes a request to the API to delete the user.
   * Clears local storage upon successful deletion.
   * Navigates to the welcome page.
   * Shows a snackbar message upon success or failure.
   */

  /**
   * Open a confirmation dialog before deleting the account.
   * If the user confirms, proceed with deleteUser().
   */
  openDeleteDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Account',
        message: 'Are you absolutely sure you want to delete your account? This action cannot be undone.',
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.deleteUser();
      }
    });
  }

  deleteUser(): void {
    this.fetchApiData.deleteUser().subscribe(() => {
      localStorage.clear(); // Clear local storage upon successful deletion
      this.router.navigate(['/welcome']); // Navigate to the welcome page
      this.snackBar.open('User successfully deleted', 'OK', {
        duration: 15000,
        panelClass: ['app-snackbar-top']
      });
    }, (error) => {
      this.snackBar.open(error, 'OK', {
        duration: 15000,
        panelClass: ['app-snackbar-top']
      });
    });
  }

  /**
   * Removes a movie from the user's favorite list.
   * Makes a request to the API to delete the movie from favorites.
   * Updates the favoriteMovies array by removing the deleted movie.
   * Shows a snackbar message upon success or failure.
   * @param {string} movieId - The ID of the movie to remove from favorites.
   */
  
  removeFavoriteMovie(movieId: string): void {
    this.fetchApiData.deleteFavoriteMovie(movieId).subscribe(() => {
      // Update the favoriteMovies array by removing the deleted movie
      this.favoriteMovies = this.favoriteMovies.filter(movie => movie._id !== movieId);
      this.snackBar.open('Movie removed from favorites', 'OK', {
        duration: 15000,
        panelClass: ['app-snackbar-top']
      });
    }, (error) => {
      console.error(error);
      this.snackBar.open('Failed to remove movie from favorites', 'OK', {
        duration: 15000,
        panelClass: ['app-snackbar-top']
      });
    });
  }

  /**
   * Opens a dialog with movie synopsis.
   * @param {any} movie - The movie object containing details.
   */
  openSynopsis(movie: any): void {
    this.dialog.open(MovieInfoComponent, {
      data: {
        title: movie.Title,
        description: movie.Description,
        genre: movie.Genre.Name,
        genreDescription: movie.Genre.Description,
        director: movie.Director.Name,
        directorBio: movie.Director.Bio,
        actors: movie.Actors,
        imagePath: movie.ImagePath,
      },
      width: '900px',
    });
  }

  /**
   * Toggles the visibility of the password input.
   */
  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}
