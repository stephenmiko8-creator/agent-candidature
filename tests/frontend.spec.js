import { test, expect } from '@playwright/test';

test('verify frontend UI changes', async ({ page }) => {
  // Go to root
  await page.goto('http://127.0.0.1:3000/');

  // Wait for the page to load
  await page.waitForTimeout(2000);

  // Verify Header has new background color
  const header = page.locator('header').first();
  await expect(header).toHaveClass(/bg-blue-900/);

  // Click on the Connexion Page/Modal (Assuming this opens AuthModal)
  // Let's take a screenshot of the main page first
  await page.screenshot({ path: '/home/jules/verification/screenshots/verification1.png' });

  // Let's try to click a button that opens the AuthModal
  // Assuming there's a button with "Get Started" that might open it. Wait, the user said "Find the Connexion page from get started button."
  const getStartedButton = page.locator('text="Get Started"');
  if (await getStartedButton.count() > 0) {
    await getStartedButton.first().click();
  } else {
      console.log('Get Started button not found');
  }

  await page.waitForTimeout(2000);

  // Check if AuthModal is open
  const modalText = page.locator('text="Connexion Portail"');
  if (await modalText.count() > 0) {
      await page.screenshot({ path: '/home/jules/verification/screenshots/verification2.png' });
  } else {
      console.log('Connexion Portail text not found');
      // maybe click login button?
      const loginBtn = page.locator('text="Connexion"').first();
      if (await loginBtn.count() > 0) {
          await loginBtn.click();
          await page.waitForTimeout(2000);
          await page.screenshot({ path: '/home/jules/verification/screenshots/verification2.png' });
      }
  }

});
