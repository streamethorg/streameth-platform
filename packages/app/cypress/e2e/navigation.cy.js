describe('Navigation', () => {
  beforeEach(() => {
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
