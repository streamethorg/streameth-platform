describe('Cookie Banner', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.clearCookies();

    cy.get('.fixed > .relative', { timeout: 10000 })
      .should('exist')
      .as('cookieBanner');
  });

  it('See if Cookie Banner exist', () => {
    cy.get('@cookieBanner')
      .should('contain.text', 'We Use Cookies 🍪')
      .and('be.visible');
  });

  // it('Accepts cookies on archive page and checks for the cookie_consent cookie', () => {
  //   cy.get('@cookieBanner').get('.mt-3 > .mr-1').click()
  //
  //   cy.wait(4000) // Wait for cookie to process
  //   cy.getCookie('cookie_consent')
  //     .debug()
  //     .then((cookie) => {
  //       expect(cookie.value).to.eq('true')
  //       expect(cookie.secure).to.be.true
  //     })
  // })

  it('"More information..." should redirect to "/privacy"', () => {
    cy.get('@cookieBanner').find('a[href*="/privacy"]').click();
    cy.url().should('include', '/privacy');
  });
});
