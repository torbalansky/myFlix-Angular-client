import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieInfoComponent } from './movie-info.component';

describe('MovieInfoComponent', () => {
  let component: MovieInfoComponent;
  let fixture: ComponentFixture<MovieInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MovieInfoComponent]
    });
    fixture = TestBed.createComponent(MovieInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * Test case to check if the MovieInfoComponent is created.
   * It verifies that the component instance is truthy.
   */

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
