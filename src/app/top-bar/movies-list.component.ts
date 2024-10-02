import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-movies-list',
  templateUrl: '../movie-card/movie-card.component.html',
  styleUrls: ['../movie-card/movie-card.component.scss']
})
export class MoviesListComponent implements OnInit {

  movies: any[] = []; // Example movie data
  filteredMovies: any[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Load all movies (this can be replaced with your movie fetching logic)
    this.movies = [
      { title: 'Inception', genre: 'Sci-Fi' },
      { title: 'The Godfather', genre: 'Drama' },
      { title: 'Get Out', genre: 'Horror' },
      // Add more movies here
    ];

    // Get search and genre filters from query params
    this.route.queryParams.subscribe(params => {
      const title = params['title'] || '';
      const genre = params['genre'] || '';

      this.filterMovies(title, genre);
    });
  }

  // Function to filter movies based on title and genre
  filterMovies(title: string, genre: string): void {
    this.filteredMovies = this.movies.filter(movie => {
      const matchesTitle = title ? movie.title.toLowerCase().includes(title.toLowerCase()) : true;
      const matchesGenre = genre ? movie.genre === genre : true;
      return matchesTitle && matchesGenre;
    });
  }
}
