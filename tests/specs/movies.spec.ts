import { test, expect } from '../fixtures/auth.fixture';

test.describe('Movie Browsing', () => {
  test('display list of movies after login', async ({ authenticatedPage: page }) => {
    // Navigate to movies page
    await page.goto('/movies');
    await page.waitForLoadState('domcontentloaded');

    // Verify movie cards are displayed
    const movieCards = page.locator('app-movie-card');
    const cardCount = await movieCards.count();

    // region agent log
    fetch('http://127.0.0.1:7639/ingest/081c9880-155f-43d8-a89f-2a7e2a99f57e', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Debug-Session-Id': 'c3abe9',
      },
      body: JSON.stringify({
        sessionId: 'c3abe9',
        runId: 'pre-fix',
        hypothesisId: 'H4',
        location: 'tests/specs/movies.spec.ts:9-15',
        message: 'Movies page card counts',
        data: {
          appMovieCardCount: cardCount,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    

    await expect(cardCount).toBeGreaterThan(0 as any);

    // Verify individual movie elements are visible
    const movieItems = page.locator('.movie-card-item, [class*="movie"], mat-card');
    await expect(movieItems.first()).toBeVisible({ timeout: 15000 });
  });

  test('click on a movie card to view details', async ({ authenticatedPage: page }) => {
    // Navigate to movies page
    await page.goto('/movies');
    await page.waitForLoadState('domcontentloaded');

    // Find and click first movie card/item
    const firstMovie = page.locator('mat-card').first();
    await expect(firstMovie).toBeVisible();
    
    // Click on the movie card to open details
    await firstMovie.click();

    // Wait for movie info dialog to appear
    await expect(page.locator('mat-dialog-container')).toBeVisible({ timeout: 15000 });

    const movieDialog = page.locator('app-movie-info');
    await expect(movieDialog).toBeVisible();

    // Poster
    const poster = movieDialog.locator('img.movie-poster');
    await expect(poster).toBeVisible();
    await poster.screenshot({ path: 'poster.png' });

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
    await page.waitForLoadState('domcontentloaded');

    // Look for search input (if available in the app)
    const searchInput = page.locator('input[placeholder*="search" i], input[name*="search" i]').first();
    
    if (await searchInput.isVisible({ timeout: 20000 }).catch(() => false)) {
      // Type in search
      await searchInput.fill('matrix');
      
      // Wait for results to filter
      await page.waitForLoadState('domcontentloaded');

      // Verify filtered results are displayed
      const movies = page.locator('mat-card');
      await expect(movies.first()).toBeVisible();
    }
  });

  test('navigate back to welcome page using close button', async ({ authenticatedPage: page }) => {
    // Navigate to movies page
    await page.goto('/movies');
    await page.waitForLoadState('domcontentloaded');

    // Look for a close or back button (e.g., in top-bar)
    const topBar = page.locator('app-top-bar');
    if (await topBar.isVisible({ timeout: 20000 }).catch(() => false)) {
      const closeBtn = topBar.locator('button[aria-label*="close" i], button:has-text("Close")').first();
      if (await closeBtn.isVisible({ timeout: 20000 }).catch(() => false)) {
        await closeBtn.click();
        //  navigate back
        await page.waitForURL('**/welcome', { timeout: 15000 });
      }
    }
  });
});
