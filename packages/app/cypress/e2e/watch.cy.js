// describe('Video Page', () => {
//   beforeEach(() => {
//     cy.visit(
//       '/watch?event=funding_the_commons_berlin_2023&session=65b8f8c9a5b2d09b88ec0d83'
//     )
//   })
//
//   it('Loads video', () => {
//     cy.get('.aspect-video >').should('exist')
//   })
//
//   it('Copy the Embed', () => {
//     cy.contains('div', 'Embed').closest('button').click()
//     // cy.contains('h2', 'Embed video').should('be.visible')
//   })
//
//   it('Share video', () => {
//     cy.contains('div', 'Share').closest('button').click()
//     // cy.contains('h2', 'Share this event').should('be.visible')
//   })
//
//   // it('Click on download button', () => {
//   //   cy.contains('div', 'Download').closest('button').click()
//   // })
//
//   it('Click on suggested video', () => {
//     cy.get('a[href*="/watch?event="]').first().click()
//   })
// })
