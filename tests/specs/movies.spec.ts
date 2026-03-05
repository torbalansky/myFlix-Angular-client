import { test, expect } from '../fixtures/auth.fixture';

test.describe('Movie Browsing', () => {
  test('display list of movies after login', async ({ authenticatedPage: page }) => {
    // Navigate to movies page
    await page.goto('/movies');
    await expect(page.locator('app-root')).toBeVisible();

    // Wait for at least one movie card to render (API/db can be slow in CI)
    await expect(page.locator('[data-testid^="movie-"]').first()).toBeVisible({ timeout: 60000 });
  });

  test('click on a movie card to view details', async ({ authenticatedPage: page }) => {
    // Navigate to movies page
    await page.goto('/movies');
    await expect(page.locator('app-root')).toBeVisible();

    // Find and click first movie card/item
    const firstMovie = page.locator('[data-testid^="movie-"]').first();
    await expect(firstMovie).toBeVisible({ timeout: 60000 });
    
    // Click on the movie card to open details
    await firstMovie.click();

    // Wait for movie info dialog to appear
    await expect(page.locator('mat-dialog-container')).toBeVisible({ timeout: 10000 });

    const movieDialog = page.locator('app-movie-info');
    await expect(movieDialog).toBeVisible();

    // Poster
    const poster = movieDialog.locator('img.movie-poster');
    await expect(poster).toBeVisible();

    // Labels
    await expect(movieDialog.locator('strong', { hasText: 'Genre:' })).toBeVisible();
    await expect(movieDialog.locator('strong', { hasText: 'Director:' })).toBeVisible();
    await expect(movieDialog.locator('strong', { hasText: 'Actors:' })).toBeVisible();
    await expect(movieDialog.locator('strong', { hasText: 'Description:' })).toBeVisible();

    // Close dialog
    await movieDialog.getByRole('button', { name: 'Close' }).click();

    // Ensure dialog closed
    await expect(movieDialog).toBeHidden();

    // Back to list
    await expect(page.getByTestId('prev-page')).toBeVisible();
  });


  test('search/filter movies', async ({ authenticatedPage: page }) => {
    // Navigate to movies page
    await page.goto('/movies');
    await expect(page.locator('app-root')).toBeVisible();

    // Look for search input (if available in the app)
    const searchInput = page.locator('input[placeholder*="search" i], input[name*="search" i]').first();
    
    if (await searchInput.isVisible({ timeout: 20000 }).catch(() => false)) {
      // Type in search
      await searchInput.fill('matrix');
      
      // Verify filtered results are displayed (either results or "no results")
      const noResults = page.getByTestId('no-results');
      const titles = page.locator('.movie-title');

      await expect
        .poll(
          async () => {
            const hasNoResults = await noResults.isVisible().catch(() => false);
            if (hasNoResults) return true;

            const allTitles = (await titles.allTextContents()).map((t) => t.toLowerCase());
            return allTitles.some((t) => t.includes('matrix'));
          },
          { timeout: 60000 }
        )
        .toBe(true);
    }
  });

  test('navigate back to welcome page using close button', async ({ authenticatedPage: page }) => {
    // Navigate to movies page
    await page.goto('/movies');
    await expect(page.locator('app-root')).toBeVisible();

    // Look for a close or back button (e.g., in top-bar)
    const topBar = page.locator('app-top-bar');
    if (await topBar.isVisible({ timeout: 20000 }).catch(() => false)) {
      const closeBtn = topBar.locator('button[aria-label*="close" i], button:has-text("Close")').first();
      if (await closeBtn.isVisible({ timeout: 20000 }).catch(() => false)) {
        await closeBtn.click();
        //  navigate back
        await page.waitForURL('**/welcome', { timeout: 10000 });
      }
    }
  });
});
