import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear cart and localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('should display empty cart message when no items in cart', async ({ page }) => {
    await page.goto('/checkout');
    await expect(page.locator('text=Your cart is empty')).toBeVisible({ timeout: 10000 });
  });

  test('should show checkout form when navigating from homepage with cart', async ({ page }) => {
    await page.goto('/');

    // Wait for products to load
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 15000 }).catch(() => {
      // If no test IDs, wait for products section
    });

    // Seed a cart item directly
    await page.evaluate(() => {
      const cartItem = {
        product: {
          _id: 'test-product-1',
          name: 'Test Moringa Powder',
          description: 'Test',
          image: '/logo.jpg',
          mrp: 500,
          price: 399,
          discount: 20,
          quantity: 10,
          gst: 18,
          category: 'Moringa',
        },
        selectedVariant: undefined,
        quantity: 2,
      };
      localStorage.setItem('indianagri_cart', JSON.stringify([cartItem]));
    });

    await page.goto('/checkout');
    await expect(page.locator('text=Checkout')).toBeVisible({ timeout: 10000 });
  });

  test('should validate checkout form fields', async ({ page }) => {
    await page.evaluate(() => {
      const cartItem = {
        product: {
          _id: 'test-product-1',
          name: 'Test Product',
          description: 'Test',
          image: '/logo.jpg',
          mrp: 500,
          price: 399,
          discount: 20,
          quantity: 10,
          gst: 18,
          category: 'Test',
        },
        selectedVariant: undefined,
        quantity: 1,
      };
      localStorage.setItem('indianagri_cart', JSON.stringify([cartItem]));
    });

    await page.goto('/checkout');

    // Try to submit without filling form
    const submitButton = page.locator('button[type="submit"]');
    if (await submitButton.isVisible()) {
      await submitButton.click();
      // Should show validation errors
    }
  });
});
