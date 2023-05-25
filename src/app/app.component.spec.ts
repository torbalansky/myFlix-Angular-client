/**

@fileoverview Tests for AppComponent.
*/

import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule],
    declarations: [AppComponent]
  }));

/**
   * Test case to check if the app component is created successfully.
   * It creates an instance of the AppComponent and checks if it is truthy.
   */

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

/**
   * Test case to check if the title property of the app component is set correctly.
   * It creates an instance of the AppComponent and checks if the title property is equal to 'myFlix-Angular-client'.
   */

  it(`should have as title 'myFlix-Angular-client'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('myFlix-Angular-client');
  });

/**
   * Test case to check if the title is rendered correctly in the app component template.
   * It creates an instance of the AppComponent, triggers change detection, and checks if the title is rendered correctly.
   */

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('myFlix-Angular-client app is running!');
  });
});
