import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) { },
    baseUrl: 'http://localhost:3000',
    defaultCommandTimeout: 6000,
    retries: {
      runMode: 3,
      openMode: 0,
    },
  },
})
