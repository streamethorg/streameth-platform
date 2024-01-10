describe('archive page', () => {

  it("search for event name", () => {
    cy.visit('http://localhost:3000/archive?event=ethberlin_2022')
    cy.get('[href="/watch?event=ethberlin_2022&session=lets_be_frens_through_lens"] > .font-semibold')
  })

  it("search for organization name", () => {
    cy.visit('http://localhost:3000/archive?organization=ethberlin')
    cy.get('[href="/watch?event=ethberlin_2022&session=lets_be_frens_through_lens"] > .font-semibold')
    cy.get('[href="/ethberlin/protocol_berg"] > .rounded-lg')
  })

  it("search for query", () => {
    cy.visit('http://localhost:3000/archive?searchQuery=lets%20be%20fr')
    cy.get('[href="/watch?event=ethberlin_2022&session=lets_be_frens_through_lens"] > .font-semibold')
  })

  it("search for speaker name", () => {
    cy.visit('http://localhost:3000/archive?searchQuery=jonas')
    cy.get('[href="/watch?event=funding_the_commons_berlin_2023&session=retroactive_public_goods_funding_2_years_in"] > .font-semibold')  })

  it("search for query in event", () => {
    cy.visit('http://localhost:3000/archive?event=ethberlin_2022&searchQuery=lets%20be%20fr')
    cy.get('[href="/watch?event=ethberlin_2022&session=lets_be_frens_through_lens"] > .font-semibold')
  })

  it("search for query in organization", () => {
    cy.visit('http://localhost:3000/archive?organization=ethberlin&searchQuery=lets%20be%20fr')
    cy.get('[href="/watch?event=ethberlin_2022&session=lets_be_frens_through_lens"] > .font-semibold')
  })

  it("search for speaker name in event", () => {
    cy.visit('http://localhost:3000/archive?event=funding_the_commons_berlin_2023&searchQuery=jonas')
    cy.get('[href="/watch?event=funding_the_commons_berlin_2023&session=retroactive_public_goods_funding_2_years_in"] > .font-semibold')  })


  it("can input search query and keep organizaton name", () => {
    cy.visit('http://localhost:3000/archive?event=funding_the_commons_berlin_2023')
    cy.get('.flex-grow > .flex-col > .flex').type('jonas')
    cy.get('.flex-grow > .flex-col > .flex').type('{enter}')
    cy.url().should('include', 'searchQuery=jonas').should('include', 'event=funding_the_commons_berlin_2023')
  })

  it("show pagination and can click next page", () => {
    cy.visit('http://localhost:3000/archive')
    cy.get(':nth-child(2) > .flex > .mx-2').should('contain', '1 of 59')
    cy.get(':nth-child(2) > .flex > :nth-child(3)').click()
    cy.url().should('include', 'page=2')
    cy.get(':nth-child(2) > .flex > .mx-2').should('contain', '2 of 59')
    cy.get(':nth-child(2) > .flex > :nth-child(3)')
  })

  // it("pagination should not show if there is only one page", () => {
  //   cy.visit('http://localhost:3000/archive?organization=ethberlin')
  //   cy.get(':nth-child(2) > .flex > .mx-2').should('not.exist')
  // })



  })