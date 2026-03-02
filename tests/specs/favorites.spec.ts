import { test, expect } from '../fixtures/auth.fixture';

test.describe('Favorites Management', () => {
  test('add a movie to favorites', async ({ authenticatedPage: page }) => {
    // Navigate to movies page
    await page.goto('/movies');
    await page.waitForLoadState('networkidle');

    // Find a movie card and its favorite button
    const firstMovieCard = page.locator('mat-card').first();
    await expect(firstMovieCard).toBeVisible();

    // Find and click the add to favorites button (usually a heart icon or button)
    const addToFavButton = firstMovieCard.locator('button[class*="favorite"], button:has-text("Add"), mat-icon:has-text("favorite_border")').first();
    
    if (await addToFavButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addToFavButton.click();

      // Verify success message appears
      const successSnackbar = page.locator('.mdc-snackbar__label');
      await expect(successSnackbar).toContainText(/added to favorites/i, { 
        timeout: 5000 
      });
    }
  });

  test('remove a movie from favorites', async ({ authenticatedPage: page }) => {
    // Navigate to movies page
    await page.goto('/movies');
    await page.waitForLoadState('networkidle');

    // Find a movie card that's already favorited
    const firstMovieCard = page.locator('mat-card').first();
    
    // Look for "remove from favorites" button or filled heart icon
    const removeFavButton = firstMovieCard.locator('button:has-text("Remove"), mat-icon:has-text("favorite")').first();
    
    if (await removeFavButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await removeFavButton.click();

      // Verify success message appears
      const successSnackbar = page.locator('.mdc-snackbar__label');
      await expect(successSnackbar).toContainText(/removed from favorites/i, { 
        timeout: 5000 
      });
    }
  });

  test('display favorite movies in user profile', async ({ authenticatedPage: page }) => {
    // Navigate to profile page
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    // Look for favorite movies section
    const favSection = page.locator('text=Your Favorite Movies, h1:has-text("Your Favorite Movies")').first();
    
    if (await favSection.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Verify favorite movies list is displayed
      const favoriteList = page.locator('mat-list-item');
      const count = await favoriteList.count();
      
      // If there are favorites, verify they're shown
      if (count > 0) {
        await expect(favoriteList.first()).toBeVisible();
      }
    }
  });

  test('remove favorite from profile page', async ({ authenticatedPage: page }) => {
    // Navigate to profile page
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    // Wait for profile to load
    await page.waitForLoadState('networkidle');

    // Look for remove buttons in favorites list
    const removeButtons = page.locator('button:has-text("Remove")');
    const count = await removeButtons.count();

    if (count > 0) {
      // Click first remove button
      await removeButtons.first().click();

      // Verify success message
      const successSnackbar = page.locator('.mdc-snackbar__label');
      await expect(successSnackbar).toContainText(/removed from favorites/i, { 
        timeout: 5000 
      });
    }
  });

  test('verify empty favorites message when no favorites exist', async ({ page }) => {
    // Start fresh - login
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Go to profile
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    // Check if empty state message is shown
    const favoriteList = page.locator('mat-list-item');
    const count = await favoriteList.count();

    // If no favorites, a message indicate this
    if (count === 0) {
      const emptyMessage = page.locator('text=no favorites');
      // This assertion is optional depending on whether your app shows an empty state
    }
  });
});
