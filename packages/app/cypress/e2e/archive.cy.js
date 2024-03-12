describe('Archive', () => {
  it('Checks the button is visually disabled', () => {
    cy.visit('/archive?event=ethberlin_2022')

    cy.get('button.p-2')
      .find('svg.lucide-arrow-left')
      .parent()
      .should('have.attr', 'disabled')
  })

  it('404 when no videos nor organisations have been found', () => {
    cy.visit(
      '/archive?searchQuery=jonaswefweijfweifjwefefopwekfowekfefopwefkweof'
    )

    cy.get('h2.text-4xl.font-bold.mb-4')
      .contains('404: Not Found')
      .should('exist')
  })

  it('Footer exists and able to scroll to', () => {
    cy.visit('/archive?searchQuery=lets%20be%20fr')
    cy.get('footer').scrollIntoView()
    cy.get('footer > a[href*="/terms"]').click()
  })

  it('Search for event name', () => {
    cy.visit('/archive?event=ethberlin_2022')
    cy.get(
      '[href="/watch?event=ethberlin_2022&session=65b8f8c6a5b2d09b88ec0ccb"] > .font-semibold'
    )
  })

  it('Search for organization name', () => {
    cy.visit('/archive?organization=ethberlin')
    cy.get(
      '[href="/watch?event=ethberlin_2022&session=65b8f8c6a5b2d09b88ec0cc2"] > .font-semibold'
    )
    cy.get('[href="/archive?event=protocol_berg"] > .inline-flex')
  })

  it('Search for query', () => {
    cy.visit('/archive?searchQuery=lets%20be%20fr')
    cy.get(
      '[href="/watch?event=ethberlin_2022&session=65b8f8c8a5b2d09b88ec0d4a"] > .font-semibold'
    )
  })

  it('Search for speaker name', () => {
    cy.visit('/archive?searchQuery=jonas')
    cy.get(
      '[href="/watch?event=funding_the_commons_berlin_2023&session=65b8f8c9a5b2d09b88ec0d83"] > .font-semibold'
    )
  })

  it('Search for query in event', () => {
    cy.visit(
      '/archive?event=ethberlin_2022&searchQuery=lets%20be%20fr'
    )
    cy.get(
      '[href="/watch?event=ethberlin_2022&session=65b8f8c8a5b2d09b88ec0d4a"] > .font-semibold'
    )
  })

  it('Search for query in organization', () => {
    cy.visit(
      '/archive?organization=ethberlin&searchQuery=lets%20be%20fr'
    )
    cy.get(
      '[href="/watch?event=ethberlin_2022&session=65b8f8c8a5b2d09b88ec0d4a"] > .font-semibold'
    )
  })

  it('Search for speaker name in event', () => {
    cy.visit(
      '/archive?event=funding_the_commons_berlin_2023&searchQuery=jonas'
    )
    cy.get(
      '[href="/watch?event=funding_the_commons_berlin_2023&session=65b8f8c9a5b2d09b88ec0d83"] > .font-semibold'
    )
  })

  it('Can input search query and keep organization name', () => {
    cy.visit('/archive?event=funding_the_commons_berlin_2023')
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
    cy.visit('/archive')
    cy.get(':nth-child(2) > .flex > .mx-2').should('contain', '1 of ')
    cy.get(':nth-child(2) > .flex > :nth-child(3)').click()

    cy.url().should('include', 'page=2')
    cy.get(':nth-child(2) > .flex > .mx-2').should('contain', '2 of ')
    cy.get(':nth-child(2) > .flex > :nth-child(3)')
  })
})
