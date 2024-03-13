describe('Cookie Banner', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.visit('/')
  })

  it('See if Cookie Banner exist', () => {
    cy.get('div[role="alert"]', { timeout: 10000 })
      .should('contain.text', 'We Use Cookies 🍪')
      .and('be.visible')
  })

  it('Accepts cookies and checks for the cookie_consent cookie', () => {
    cy.get('div[role="alert"]', { timeout: 10000 })
      .contains('button', 'Ok')
      .click()

    cy.getCookie('cookie_consent').then((cookie) => {
      expect(cookie.value).to.eq('true')
      expect(cookie.secure).to.be.true
    })
  })

  it('Accepts cookies on archive page and checks for the cookie_consent cookie', () => {
    cy.visit('/archive')
    cy.get('div[role="alert"]', { timeout: 10000 })
      .contains('button', 'Ok')
      .click()

    cy.getCookie('cookie_consent').then((cookie) => {
      expect(cookie.value).to.eq('true')
      expect(cookie.secure).to.be.true
    })
  })

  it('"More information..." should redirect to "/privacy"', () => {
    cy.get('div[role="alert"] a[href*="/privacy"]', {
      timeout: 10000,
    }).click()
    cy.url().should('include', '/privacy')
  })
})
