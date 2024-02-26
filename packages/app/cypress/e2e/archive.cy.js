describe('archive page', () => {
  it('search for event name', () => {
    cy.visit('http://localhost:3000/archive?event=ethberlin_2022')
    cy.get(
      '[href="/watch?event=ethberlin_2022&session=65b8f8c6a5b2d09b88ec0ccb"] > .font-semibold'
    )
  })
  Cypress.on('uncaught:exception', (err, runnable) => {
    return false
  })
  it('search for organization name', () => {
    cy.visit('http://localhost:3000/archive?organization=ethberlin')
    cy.get(
      '[href="/watch?event=ethberlin_2022&session=65b8f8c6a5b2d09b88ec0cc2"] > .font-semibold'
    )
    cy.get('[href="/archive?event=protocol_berg"] > .inline-flex')
  })

  it('search for query', () => {
    cy.visit(
      'http://localhost:3000/archive?searchQuery=lets%20be%20fr'
    )
    cy.get(
      '[href="/watch?event=ethberlin_2022&session=65b8f8c8a5b2d09b88ec0d4a"] > .font-semibold'
    )
  })

  it('search for speaker name', () => {
    cy.visit('http://localhost:3000/archive?searchQuery=jonas')
    cy.get(
      '[href="/watch?event=funding_the_commons_berlin_2023&session=65b8f8c9a5b2d09b88ec0d83"] > .font-semibold'
    )
  })

  it('search for query in event', () => {
    cy.visit(
      'http://localhost:3000/archive?event=ethberlin_2022&searchQuery=lets%20be%20fr'
    )
    cy.get(
      '[href="/watch?event=ethberlin_2022&session=65b8f8c8a5b2d09b88ec0d4a"] > .font-semibold'
    )
  })

  it('search for query in organization', () => {
    cy.visit(
      'http://localhost:3000/archive?organization=ethberlin&searchQuery=lets%20be%20fr'
    )
    cy.get(
      '[href="/watch?event=ethberlin_2022&session=65b8f8c8a5b2d09b88ec0d4a"] > .font-semibold'
    )
  })

  it('search for speaker name in event', () => {
    cy.visit(
      'http://localhost:3000/archive?event=funding_the_commons_berlin_2023&searchQuery=jonas'
    )
    cy.get(
      '[href="/watch?event=funding_the_commons_berlin_2023&session=65b8f8c9a5b2d09b88ec0d83"] > .font-semibold'
    )
  })

  it('Can input search query and keep organization name', () => {
    cy.visit(
      'http://localhost:3000/archive?event=funding_the_commons_berlin_2023'
    )
    cy.get('.flex-grow > .flex-col > .flex').type('jonas')
    cy.get('.flex-grow > .flex-col > .flex').type('{enter}')
    cy.url()
      .should('include', 'searchQuery=jonas')
      .should('include', 'event=funding_the_commons_berlin_2023')
  })

  it('Show pagination and can click next page', () => {
    cy.intercept('GET', '/archive?searchQuery=jonas').as(
      'searchForJonas'
    )
    cy.visit('http://localhost:3000/archive')
    cy.get(':nth-child(2) > .flex > .mx-2').should(
      'contain',
      '1 of 68'
    )
    cy.get(':nth-child(2) > .flex > :nth-child(3)').click()

    cy.url().should('include', 'page=2')
    cy.get(':nth-child(2) > .flex > .mx-2').should(
      'contain',
      '2 of 68'
    )
    cy.get(':nth-child(2) > .flex > :nth-child(3)')
  })

  // it("pagination should not show if there is only one page", () => {
  //   cy.visit('http://localhost:3000/archive?organization=ethberlin')
  //   cy.get(':nth-child(2) > .flex > .mx-2').should('not.exist')
  // })
})
