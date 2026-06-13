import { test, expect } from '@playwright/test';
 
test.describe('StaJob Frontend Critical Flows', () => {
  
  test.beforeEach(async ({ page }) => {
    // Go to the home page before each test
    await page.goto('/');
  });
 
  test('verify home page elements', async ({ page }) => {
    await expect(page.getByText('StaJob', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Apply smarter.')).toBeVisible();
    const getStartedBtn = page.getByRole('button', { name: 'Get Started' });
    await expect(getStartedBtn).toBeVisible();
  });
 
  test('login flow via demo bypass', async ({ page }) => {
    // Click "Get Started" to open AuthModal
    await page.getByRole('button', { name: 'Get Started' }).click();
    await expect(page.getByText('Connexion Portail')).toBeVisible();
 
    // Click "Connexion Candidat Standard" (Demo Bypass)
    await page.getByRole('button', { name: /Connexion Candidat Standard/i }).click();
 
    // After login, it should navigate to the Builder view
    // Check if the Builder view is visible (e.g., look for "Lancer l'agent")
    await expect(page.getByText(/Lancer l'agent/i)).toBeVisible();
  });
 
  test('chatbot interaction', async ({ page }) => {
    // 1. Login first
    await page.getByRole('button', { name: 'Get Started' }).click();
    await page.getByRole('button', { name: /Connexion Candidat Standard/i }).click();
    
    // 2. Wait for the chatbot input to be visible in the Builder view
    const chatInput = page.getByPlaceholder('Pose une question à StaJob...');
    await expect(chatInput).toBeVisible();
 
    // 3. Mock the chatbot API response
    await page.route('**/api/chatbot', async route => {
      const json = { text: "Je suis là pour vous aider avec votre CV !" };
      await route.fulfill({ json });
    });
 
    // 4. Send a message
    await chatInput.fill('Bonjour StaJob');
    await page.keyboard.press('Enter');
 
    // 5. Check if the message appears in the chat
    await expect(page.getByText('Bonjour StaJob')).toBeVisible();
    await expect(page.getByText('Je suis là pour vous aider avec votre CV !')).toBeVisible();
  });

  test('navigation to dashboard (CRM)', async ({ page }) => {
    // 1. Login
    await page.getByRole('button', { name: 'Get Started' }).click();
    await page.getByRole('button', { name: /Connexion Candidat Standard/i }).click();

    // 2. Click on "Tableau de bord" or "Mon CRM" in the header/nav
    // In HeroSection.jsx, it's not in the main nav once logged in?
    // Wait, AgentCandidature handles its own nav if activeView is changed.
    // Let's check AgentCandidature.jsx for the navigation buttons.
    
    // In AgentCandidature.jsx (approx line 1500+):
    // There should be buttons to switch between Optimiseur and CRM.
    
    const crmTab = page.getByText(/Mon CRM/i).first();
    await crmTab.click();

    // Check if Kanban columns are visible
    await expect(page.getByText(/Draft/i)).toBeVisible();
    await expect(page.getByText(/Applied/i)).toBeVisible();
  });

  test('spotlight search functionality', async ({ page }) => {
    // 1. Open search
    await page.keyboard.press('Control+k');
    const searchInput = page.getByPlaceholder(/Rechercher une candidature/i);
    
    // 2. Type something
    await searchInput.fill('Google');
    
    // 3. Since we don't have real data in localStorage during tests, 
    // it should show "Aucune candidature trouvée"
    await expect(page.getByText(/Aucune candidature trouvée/i)).toBeVisible();
  });
});
