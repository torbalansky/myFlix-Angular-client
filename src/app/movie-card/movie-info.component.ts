import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-movie-info',
  template: `
    <h1 mat-dialog-title>{{ data.title }}</h1>
    <div mat-dialog-content>
      <img [src]="data.image" [alt]="data.title" class="movie-image" />
      <p><strong>Description:</strong> {{ data.description }}</p>
      <p><strong>Genre:</strong> {{ data.genre }}</p>
      <p><strong>Genre Description:</strong> {{ data.genreDescription }}</p>
      <p><strong>Director:</strong> {{ data.director }}</p>
      <p><strong>Director Bio:</strong> {{ data.directorBio }}</p>
      <p><strong>Actors:</strong> {{ data.actors.join(', ') }}</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onClose()">Close</button>
    </div>
  `,
  styles: [`
    .movie-image {
      width: 100%;
      height: auto;
      margin-bottom: 10px;
    }
  `]
})
export class MovieInfoComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  onClose(): void {
    // Logic for closing the dialog can go here if needed
  }
}
