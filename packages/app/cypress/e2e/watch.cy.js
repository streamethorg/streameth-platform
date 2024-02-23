describe('watch page', () => {
  beforeEach(() => {
    cy.visit(
      'http://localhost:3000/watch?event=funding_the_commons_berlin_2023&session=65b8f8c9a5b2d09b88ec0d83',
      { failOnStatusCode: false }
    )
  })
  Cypress.on('uncaught:exception', (err, runnable) => {
    return false
  })
  it('loads video', () => {
    cy.get('.aspect-video >').should('exist')
  })

  it('action bar works', () => {
    cy.get('.text-2xl')
    cy.get('.flex-col > .text-muted-foreground > .text-sm')
    cy.get('[aria-controls="radix-:rb:"] > .inline-flex').click({
      force: true,
    })
  })
})
