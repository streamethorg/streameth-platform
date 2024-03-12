// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

Cypress.on('uncaught:exception', (err, runnable) => {
  const errorsToIgnore = [
    'NEXT_NOT_FOUND',
    'Hydration failed because the initial UI does not match what was rendered on the server',
    'There was an error while hydrating this Suspense boundary. Switched to client rendering.',
  ]

  const shouldIgnoreError = errorsToIgnore.some((errorText) =>
    err.message.includes(errorText)
  )

  if (shouldIgnoreError) {
    return false
  }

  return undefined
})

beforeEach(() => {
  cy.viewport(1200, 1000)
})
