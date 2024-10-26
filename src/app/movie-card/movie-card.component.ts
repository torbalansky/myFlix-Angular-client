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
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 0;

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
      this.calculateTotalPages();
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

    this.currentPage = 1;
    this.calculateTotalPages();
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredMovies.length / this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  firstPage(): void {
    this.currentPage = 1;
  }

  lastPage(): void {
    this.currentPage = this.totalPages;
  }

  get paginatedMovies(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredMovies.slice(startIndex, startIndex + this.itemsPerPage);
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
