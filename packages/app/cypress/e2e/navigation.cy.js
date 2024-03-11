describe('Navigation', () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit('/')
  })

  it('should navigate to the info page', () => {
    cy.get(
      'a[href*="https://info.streameth.org/stream-eth-studio"]'
    ).click()
  })

  it('Click on the logo to redirect to the homepage again', () => {
    cy.get('nav > a[href*="/"]').click('topLeft')
  })

  it('Shows a 404 page for non-existent routes', () => {
    cy.visit('/some-non-existent-route', { failOnStatusCode: false })

    cy.get('h2.text-4xl.font-bold.mb-4')
      .contains('404: Not Found')
      .should('exist')
  })
})
