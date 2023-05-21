import { Component } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MovieInfoComponent } from '../movie-info/movie-info.component';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
        this.movies = resp;
        console.log(this.movies);
        return this.movies;
      });
    }

  openSynopsis(description: string): void {
    this.dialog.open(MovieInfoComponent, {
      data: {
        title: 'Synopsis',
        content: description
      },
      width: '400px'
      });
    }

  openGenre(name: string, description: string): void {
    this.dialog.open(MovieInfoComponent, {
      data: {
        title: name,
        content: description
      },
      width: '280px'
    });
  }

  openDirector(name: string): void {
    this.dialog.open(MovieInfoComponent, {
      data: {
        title: name
      },
      width: '280px'
    });
  }

  addFavorite(id: string): void {
    this.fetchApiData.addFavoriteMovie(id).subscribe((result) => {
    this.snackBar.open('Movie added to favorites!', 'OK', {
        duration: 2000
      });
    });
  }

  isFavorite(id: string): boolean {
    return this.fetchApiData.isFavoriteMovie(id);
  }

  removeFavorite(id: string): void {
    this.fetchApiData.deleteFavoriteMovie(id).subscribe((result) => {
      this.snackBar.open('Movie removed from favorites!', 'OK', {
        duration: 2000
      });
    });
  }
}
