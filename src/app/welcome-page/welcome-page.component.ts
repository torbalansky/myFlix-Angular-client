import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { UserLoginFormComponent } from '../user-login-form/user-login-form.component';
import { MatDialog } from '@angular/material/dialog';
import { MovieCardComponent } from '../movie-card/movie-card.component';

/**
 * The component representing the welcome page of the app.
 */

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent implements OnInit, AfterViewInit {

  constructor(public dialog: MatDialog) { }

/**
   * Lifecycle hook called after the component has been initialized.
   */

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initializeMatrixAnimation();
  }

  initializeMatrixAnimation(): void {
    const canvas = document.getElementById('matrixCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    const matrix = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}".split("");
    const fontSize = 10;
    const columns = canvas.width / fontSize;
    const drops: number[] = Array.from({ length: columns }, () => 1);

    function draw() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#00ff6e";
      ctx.font = `${fontSize}px Arial`;

      for (let i = 0; i < drops.length; i++) {
        const text = matrix[Math.floor(Math.random() * matrix.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    setInterval(draw, 35);
  }

/**
   * Opens the user registration dialog.
   */

  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      width: '480px'
    });
  }

/**
   * Opens the user login dialog.
   */

  openUserLoginDialog(): void {
      this.dialog.open(UserLoginFormComponent, {
        width: '480px'
      });
    }

 /**
   * Opens the movies dialog.
   */

  openMoviesDialog(): void {
    this.dialog.open(MovieCardComponent, {
      width: '200px'
    });
  }
}


