describe('Cookie Banner', () => {
  it('See if Cookie Banner exist', () => {
    cy.visit('/')
    cy.get('div[role="alert"]')
      .should('contain.text', 'We Use Cookies 🍪')
      .and('be.visible')
  })

  it('Accepts cookies and checks for the cookie_consent cookie', () => {
    cy.visit('/')
    cy.get('div[role="alert"]').contains('button', 'Ok').click()

    cy.wait(2000)
    cy.getCookie('cookie_consent').then((cookie) => {
      expect(cookie.value).to.eq('true')
      expect(cookie.secure).to.be.true
    })
  })

  it('Accepts cookies on archive page and checks for the cookie_consent cookie', () => {
    cy.visit('/archive')
    cy.get('div[role="alert"]').contains('button', 'Ok').click()

    cy.wait(2000)
    cy.getCookie('cookie_consent').then((cookie) => {
      expect(cookie.value).to.eq('true')
      expect(cookie.secure).to.be.true
    })
  })

  it('"More information..." should redirect to "/privacy"', () => {
    cy.visit('/')
    cy.get('div[role="alert"] a[href*="/privacy"]').click()
    cy.url().should('include', '/privacy')
  })
})
