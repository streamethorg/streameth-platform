import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    defaultCommandTimeout: 6000,
    retries: {
      runMode: 3,
      openMode: 0,
    },
  },
})
