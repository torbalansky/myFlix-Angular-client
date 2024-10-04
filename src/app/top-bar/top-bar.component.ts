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

  constructor(
    private router: Router,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {}

  filterMovies(): void {
    this.searchService.changeSearchTerm(this.searchTerm);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchService.changeSearchTerm('');
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
