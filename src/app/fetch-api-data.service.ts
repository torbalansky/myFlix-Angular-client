import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

  //Declaring the api url that will provide data for the client app
  const apiUrl = "https://torbalansk-myflix-app.herokuapp.com/"
  @Injectable({
    providedIn: 'root'
  })

  export class FetchApiDataService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
    constructor(private http: HttpClient) { } 

  public userRegistration (userDetails: any): Observable<any>{
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
    catchError(this.handleError)
    )
  }

  public userLogin (userDetails: any): Observable<any>{
    console.log('Login request payload:', userDetails);
    return this.http.post(apiUrl + 'login', userDetails).pipe(
    catchError(this.handleError)
    )
  }
  
  // GET requests
  // Api call to get all movies endpoint
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies', {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Api call to get one movie endpoint
  getOneMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/' + title, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Api call to get one director endpoint
  getOneDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/director/' + directorName, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Api call to get one genre endpoint
  getOneGenre(genreName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/genre/' + genreName, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Api call to get one user endpoint
  getOneUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/' + user.Username, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Api call to get favourite movies for a user endpoint
  getFavoriteMovies(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');;
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/' + user.Username, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      map((data) => data.FavoriteMovies),
      catchError(this.handleError)
    );
  }

  addFavoriteMovie(movieId: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    user.FavoriteMovies.push(movieId);
    localStorage.setItem('user', JSON.stringify(user));
    return this.http.post(apiUrl + 'users/' + user.Username + '/movies/' + movieId, {}, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        }),
        responseType: "text",
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  isFavoriteMovie(movieId: string): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.FavoriteMovies.indexOf(movieId) >= 0;
  }

  deleteFavoriteMovie(movieId: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    const index = user.FavoriteMovies.indexOf(movieId);
      console.log(index);
      if (index > -1) { 
        user.FavoriteMovies.splice(index, 1); 
      }
      localStorage.setItem('user', JSON.stringify(user));
    return this.http.delete(apiUrl + 'users/' + user.Username + '/movies/' + movieId, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        }),
        responseType: "text",
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Making the api call for the edit user endpoint
  editUser(updatedUser: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.put(apiUrl + 'users/' + user.Username, updatedUser, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }
  
  //DELETE requests
  // Making the api call for the delete user endpoint
  deleteUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    console.log(headers);
  
    return this.http
      .delete(apiUrl + 'users/' + user.Username, { headers: headers }) // Pass headers as options object
      .pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }  

  // Non-typed response extraction
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    }
    else if (error.error.errors) {
      return throwError(() => new Error(error.error.errors[0].msg));
    }
    else {
      console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`);
    }
    return throwError (() => new Error ('Something went wrong')
    );
  }
}