import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLoginFormComponent } from './user-login-form.component';

describe('UserLoginFormComponent', () => {
  let component: UserLoginFormComponent;
  let fixture: ComponentFixture<UserLoginFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserLoginFormComponent]
    });
    fixture = TestBed.createComponent(UserLoginFormComponent);
    component = fixture.componentInstance;
    // Trigger change detection to initialize the component
    fixture.detectChanges();
  });

 /**
   * Test case to check if the UserLoginFormComponent is created.
   * It verifies that the component instance is truthy.
   */

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
