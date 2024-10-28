import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private searchTermSource = new BehaviorSubject<string>('');
  currentSearchTerm = this.searchTermSource.asObservable();

  private genreSource = new BehaviorSubject<string>('');
  currentGenre = this.genreSource.asObservable();

  constructor() {}

  changeSearchTerm(term: string): void {
    this.searchTermSource.next(term);
  }

  changeGenre(genre: string): void {
    this.genreSource.next(genre);
  }
}
