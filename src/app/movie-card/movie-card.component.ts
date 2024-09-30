import { Component } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MovieInfoComponent } from '../movie-info/movie-info.component';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Component representing a movie card.
 */

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent {
  movies: any[] = [];
  constructor(public fetchApiData: FetchApiDataService,
  public dialog: MatDialog,
  public snackBar: MatSnackBar) { }

   /**
   * Lifecycle hook called after the component has been initialized.
   */

  ngOnInit(): void {
    this.getMovies();
  }

  /**
   * Retrieves all movies from the API.
   * @returns {any[]} Array of movies.
   */

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
        this.movies = resp;
        console.log(this.movies);
        return this.movies;
      });
    }

  /**
   * Opens a dialog to display the movie's synopsis.
   * @param {string} description - The movie's description.
   */

  openSynopsis(description: string): void {
    this.dialog.open(MovieInfoComponent, {
      data: {
        title: 'Synopsis',
        content: description
      },
      width: '400px'
      });
    }

 /**
   * Opens a dialog to display the movie's genre.
   * @param {string} name - The genre's name.
   * @param {string} description - The genre's description.
   */

  openGenre(name: string, description: string): void {
    this.dialog.open(MovieInfoComponent, {
      data: {
        title: name,
        content: description
      },
      width: '500px'
    });
  }

/**
   * Opens a dialog to display the movie's director.
   * @param {string} name - The director's name.
   */

  openDirector(name: string): void {
    this.dialog.open(MovieInfoComponent, {
      data: {
        title: name
      },
      width: '280px'
    });
  }

 /**
   * Adds a movie to the user's favorites.
   * @param {string} id - The ID of the movie.
   */

  addFavorite(id: string): void {
    this.fetchApiData.addFavoriteMovie(id).subscribe((result) => {
    this.snackBar.open('Movie added to favorites!', 'OK', {
        duration: 2000
      });
    });
  }

/**
   * Checks if a movie is in the user's favorites.
   * @param {string} id - The ID of the movie.
   * @returns {boolean} Returns true if the movie is a favorite, otherwise false.
   */

  isFavorite(id: string): boolean {
    return this.fetchApiData.isFavoriteMovie(id);
  }

/**
   * Removes a movie from the user's favorites.
   * @param {string} id - The ID of the movie.
   */

  removeFavorite(id: string): void {
    this.fetchApiData.deleteFavoriteMovie(id).subscribe((result) => {
      this.snackBar.open('Movie removed from favorites!', 'OK', {
        duration: 2000
      });
    });
  }
}
