import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-movie-info',
  templateUrl: './movie-info.component.html',
  styleUrls: ['./movie-info.component.scss']
})
export class MovieInfoComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      title: string;
      description: string;
      genre: string;
      genreDescription: string;
      director: string;
      directorBio: string;
      actors: string[];
      imagePath: string;
    }
  ) {}
}
