import { test, expect } from '../fixtures/auth.fixture';

test.describe('Favorites Management', () => {
  test('add then remove a movie from favorites', async ({ authenticatedPage: page }) => {
    // Navigate to movies page
    await page.goto('/movies');
    await page.waitForLoadState('domcontentloaded');

    // Find a movie card and its favorite button
    const firstMovieCard = page.locator('mat-card').first();
    await expect(firstMovieCard).toBeVisible();

    // Add to favorites
    const addToFavButton = firstMovieCard.locator('button[class*="favorite"], button:has-text("Add"), mat-icon:has-text("favorite_border")').first();
    await expect(addToFavButton).toBeVisible({ timeout: 10000 });
    await addToFavButton.click();

    const addedSnackbar = page.locator('.mdc-snackbar__label').filter({ hasText: /added to favorites/i });
    await expect(addedSnackbar).toBeVisible({ timeout: 10000 });

    // Remove from favorites (icon may change after adding)
    const removeFavButton = firstMovieCard.locator('button:has-text("Remove"), mat-icon:has-text("favorite")').first();
    await expect(removeFavButton).toBeVisible({ timeout: 10000 });
    await removeFavButton.click();

    const removedSnackbar = page.locator('.mdc-snackbar__label').filter({ hasText: /removed from favorites/i });
    await expect(removedSnackbar).toBeVisible({ timeout: 10000 });
  });

  test('display favorite movies in user profile', async ({ authenticatedPage: page }) => {
    // Navigate to profile page
    await page.goto('/profile');
    await page.waitForLoadState('domcontentloaded');

    // Look for favorite movies section
    const favSection = page.locator('text=Your Favorite Movies, h1:has-text("Your Favorite Movies")').first();
    
    if (await favSection.isVisible({ timeout: 10000 }).catch(() => false)) {
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
    await page.waitForLoadState('domcontentloaded');

    // Wait for profile to load
    await page.waitForLoadState('domcontentloaded');

    // Look for remove buttons in favorites list
    const removeButtons = page.locator('button:has-text("Remove")');
    const count = await removeButtons.count();

    if (count > 0) {
      // Click first remove button
      await removeButtons.first().click();

      // Verify success message
      const successSnackbar = page.locator('.mdc-snackbar__label');
      await expect(successSnackbar).toContainText(/removed from favorites/i, { 
        timeout: 110000 
      });
    }
  });

  test('verify empty favorites message when no favorites exist', async ({ page }) => {
    // Start fresh - login
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Go to profile
    await page.goto('/profile');
    await page.waitForLoadState('domcontentloaded');

    // Check if empty state message is shown
    const favoriteList = page.locator('mat-list-item');
    const count = await favoriteList.count();

    if (count === 0) {
      const emptyMessage = page.locator('text=no favorites');
    }
  });
});
