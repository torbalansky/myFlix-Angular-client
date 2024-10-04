import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MovieInfoComponent } from '../movie-info/movie-info.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SearchService } from '../SearchService';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  filteredMovies: any[] = [];
  searchTerm: string = '';

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.getMovies();
    this.searchService.currentSearchTerm.subscribe(term => {
      this.searchTerm = term;
      this.filterMovies();
    });
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      this.filteredMovies = resp;
      console.log(this.movies);
    });
  }

  filterMovies(): void {
    if (this.searchTerm) {
      this.filteredMovies = this.movies.filter(movie =>
        movie.Title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredMovies = this.movies;
    }
  }

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

  openGenre(name: string, genre: string): void {
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
        duration: 2000,
      });
    });
  }

  removeFavorite(id: string): void {
    this.fetchApiData.deleteFavoriteMovie(id).subscribe((result) => {
      this.snackBar.open('Movie removed from favorites!', 'OK', {
        duration: 2000,
      });
    });
  }

  isFavorite(id: string): boolean {
    return this.fetchApiData.isFavoriteMovie(id);
  }
}
