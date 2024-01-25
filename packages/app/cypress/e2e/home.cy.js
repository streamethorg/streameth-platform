describe('example to-do app', () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit('http://localhost:3000/')
    cy.scrollTo('bottom')
  })

  it('displays list of organizations', () => {
    cy.get(':nth-child(3) > .my-2 > a > .font-semibold').should(
      'contain',
      'ETHBerlin'
    )

    // cy.get(':nth-child(3) > .my-2 > a > .font-semibold').invoke('css', 'width').should('match', /300.*px/)
  })

  it('can search', () => {
    cy.get('.flex-grow > .flex-col > .flex').type('jonas')
    cy.get('.flex-grow > .flex-col > .flex').type('{enter}')
  })

  it('can click image', () => {
    cy.get(
      ':nth-child(2) > .overflow-y-scroll > .max-w-screen > .lg\\:grid > :nth-child(1) > .min-h-full'
    ).click()
  })

  it('can click description', () => {
    cy.viewport(1200, 800)
    cy.get(
      ':nth-child(2) > .min-h-full > .flex-col > [href="/archive?event=ethporto_2023"] > .flex > .text-xs'
    ).click()
  })

  it('can click organization name', () => {
    cy.viewport(1200, 800)
    cy.get(':nth-child(1) > .my-2 > a > .font-semibold').click()
  })
})
