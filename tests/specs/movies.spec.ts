import { test, expect } from '../fixtures/auth.fixture';

test.describe('Movie Browsing', () => {
  test('display list of movies after login', async ({ authenticatedPage: page }) => {
    // Navigate to movies page
    await page.goto('/movies', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('app-root')).toBeVisible();

    // Wait for at least one movie card to render (API/db can be slow in CI)
    await expect(page.locator('[data-testid^="movie-"]').first()).toBeVisible({ timeout: 60000 });
  });

  test('click on a movie card to view details', async ({ authenticatedPage: page }) => {
    // Navigate to movies page
    await page.goto('/movies', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('app-root')).toBeVisible();

    // Wait for movies API to return and movies to be rendered
    await page.waitForResponse(resp =>
      resp.url().includes('/movies') && resp.status() === 200
    );

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
    await page.goto('/movies', { waitUntil: 'domcontentloaded' });
  
    // Wait for movies API to return
    await page.waitForResponse(resp =>
      resp.url().includes('/movies') && resp.status() === 200
    );
  
    // Ensure movies are actually rendered
    const movieCards = page.locator('[data-testid^="movie-"]');
    await expect(movieCards.first()).toBeVisible();
  
    // Now find search input (must exist — no conditional logic)
    const searchInput = page.getByRole('textbox', { name: /search/i });
  
    await expect(searchInput).toBeVisible();
    await searchInput.fill('matrix');
  
    // Wait for filtering to apply
    await expect
      .poll(async () => {
        const titles = await page.locator('.movie-title').allTextContents();
        return titles.every(title =>
          title.toLowerCase().includes('matrix')
        );
      })
      .toBe(true);
  });

  test('navigate back to welcome page using close button', async ({ authenticatedPage: page }) => {
    // Navigate to movies page
    await page.goto('/movies', { waitUntil: 'domcontentloaded' });
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
