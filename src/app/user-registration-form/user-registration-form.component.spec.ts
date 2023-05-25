import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRegistrationFormComponent } from './user-registration-form.component';

describe('UserRegistrationFormComponent', () => {
  let component: UserRegistrationFormComponent;
  let fixture: ComponentFixture<UserRegistrationFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserRegistrationFormComponent]
    });
    // Create a fixture and get the component instance
    fixture = TestBed.createComponent(UserRegistrationFormComponent);
    component = fixture.componentInstance;
     // Trigger change detection to initialize the component
    fixture.detectChanges();
  });

  /**
   * Test case to check if the UserRegistrationFormComponent is created.
   * It verifies that the component instance is truthy.
   */

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
