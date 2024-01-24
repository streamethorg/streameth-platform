describe('watch page', () => {
  beforeEach(() => {
    cy.visit(
      'http://localhost:3000/watch?event=funding_the_commons_berlin_2023&session=65a9ef93973b44084122622f',
      { failOnStatusCode: false }
    )
  })

  it('loads video', () => {
    cy.get('.aspect-video > .rounded').should('exist')
  })

  it('action bar works', () => {
    cy.get('.text-2xl')
    cy.get('.flex-col > .text-muted-foreground > .text-sm')
    cy.get('[aria-controls="radix-:r0:"] > .inline-flex').click()
    cy.get('#radix-:r0: > div > button:nth-child(4) > svg')
  })
})
