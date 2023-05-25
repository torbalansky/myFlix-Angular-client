import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [];

@NgModule({

  /**
   * Imports the RouterModule and configures the routes for the application.
   * RouterModule.forRoot() sets up the router with the provided routes.
   * The routes array will contain the route configurations for the application.
   */

  imports: [RouterModule.forRoot(routes)],

  /**
   * Exports the RouterModule to make it available for other modules to import.
   * Exporting RouterModule allows other modules to use the router directives and features.
   */
  
  exports: [RouterModule]
})
export class AppRoutingModule { }
