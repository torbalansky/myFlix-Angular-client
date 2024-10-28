import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from '../SearchService';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {
  searchTerm: string = '';
  selectedGenre: string = '';
  genres: string[] = ['Action', 'Drama', 'Crime', 'Horror', 'Science Fiction', 'Thriller', 'Fantasy', 'Comedy'];

  constructor(
    private router: Router,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {}

  filterMovies(): void {
    this.searchService.changeSearchTerm(this.searchTerm);
    this.searchService.changeGenre(this.selectedGenre);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.selectedGenre = '';
    this.searchService.changeSearchTerm('');
    this.searchService.changeGenre('');
  }

  toMovies(): void {
    this.router.navigate(['movies']);
  }

  toProfile(): void {
    this.router.navigate(['profile']);
  }

  logOut(): void {
    this.router.navigate(['welcome']);
    localStorage.clear();
  }
}
