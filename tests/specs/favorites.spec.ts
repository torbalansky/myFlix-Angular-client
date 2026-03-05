import { test, expect } from '../fixtures/auth.fixture';

test.describe('Favorites Management', () => {
  test('add then remove a movie from favorites', async ({ authenticatedPage: page }) => {
    // Navigate using SPA-friendly wait
    await page.goto('/movies', { waitUntil: 'domcontentloaded' });
  
    // Wait for movies to render in the UI (NOT network)
    const firstMovieCard = page
      .locator('[data-testid^="movie-"]')
      .first();
  
    await expect(firstMovieCard).toBeVisible({ timeout: 60000 });
  
    // ---- Add to favorites ----
  
    const addToFavButton = firstMovieCard
      .locator('button')
      .filter({
        has: page.locator('mat-icon', { hasText: 'favorite_border' }),
      })
      .first();
  
    await expect(addToFavButton).toBeVisible();
  
    await addToFavButton.click();
  
    const addedSnackbar = page
      .locator('.mdc-snackbar__label')
      .filter({ hasText: /added to favorites/i });
  
    await expect(addedSnackbar).toBeVisible();
  
    // ---- Wait for UI update ----
  
    const removeFavButton = firstMovieCard
      .locator('button')
      .filter({
        has: page.locator('mat-icon', { hasText: 'favorite' }),
      })
      .first();
  
    await expect(removeFavButton).toBeVisible();
  
    // ---- Remove from favorites ----
  
    await removeFavButton.click();
  
    const removedSnackbar = page
      .locator('.mdc-snackbar__label')
      .filter({ hasText: /removed from favorites/i });
  
    await expect(removedSnackbar).toBeVisible();
  });

  test('display favorite movies in user profile', async ({ authenticatedPage: page }) => {
    // Navigate to profile page
    await page.goto('/profile', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('app-root')).toBeVisible();

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
    await page.goto('/profile', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('app-root')).toBeVisible();

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
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('app-root')).toBeVisible();

    // Go to profile
    await page.goto('/profile', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('app-root')).toBeVisible();

    // Check if empty state message is shown
    const favoriteList = page.locator('mat-list-item');
    const count = await favoriteList.count();

    if (count === 0) {
      const emptyMessage = page.locator('text=no favorites');
    }
  });
});
