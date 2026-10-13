import { defineConfig, devices } from '@playwright/test'

const port = 4173
const isCi = Boolean(process.env.CI)
// E2E_FERDIGBYGD=1: test en dist/ som allerede er bygd (brukes i deploy.yml), uten å bygge på nytt.
const prebuilt = process.env.E2E_FERDIGBYGD === '1'
const preview = `npm run preview -- --port ${String(port)} --strictPort`

export default defineConfig({
  testDir: 'e2e',
  forbidOnly: isCi,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: `http://localhost:${String(port)}`,
    screenshot: 'on',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: prebuilt ? preview : `npm run build && ${preview}`,
    url: `http://localhost:${String(port)}`,
    reuseExistingServer: !isCi,
  },
})
