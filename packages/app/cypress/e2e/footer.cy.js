describe('Footer', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('footer').scrollIntoView();
  });

  it('Click on "About us"', () => {
    cy.get('footer > a[href*="https://streameth.org/"]').click();
  });

  it('Click on "Contact us"', () => {
    cy.get('footer > a[href*="https://streameth.org/#team"]').click();
  });

  it('Click on "Docs"', () => {
    cy.get(
      'footer > a[href*="https://streameth.notion.site/a473a629420b4942904c851155a18c9b?v=4a29b97e7fd94bbbb38269cb808d3ac4"]'
    ).click();
  });

  it('Click on "Privacy"', () => {
    cy.get('footer > a[href*="/privacy"]').click();
  });

  it('Visit "Privacy" & scroll through it', () => {
    cy.visit('/privacy');

    cy.scrollTo('center');
    cy.scrollTo('bottom');

    cy.scrollTo('left', { ensureScrollable: false });
    cy.scrollTo('right', { ensureScrollable: false });
  });

  it('Verifies unique content on the "Privacy" page', () => {
    cy.visit('/privacy');

    cy.contains('h1', 'StreamETH International B.V. Privacy Policy').should(
      'exist'
    );

    cy.get('img[alt="StreamETH logo"]').should('be.visible');
  });

  it('Click on "Terms"', () => {
    cy.get('footer > a[href*="/terms"]').click();
  });

  it('Visit "Terms" & scroll through it', () => {
    cy.visit('/terms');

    cy.scrollTo('center');
    cy.scrollTo('bottom');

    cy.scrollTo('left', { ensureScrollable: false });
  });

  it('Verifies unique content on the "terms" page', () => {
    cy.visit('/terms');

    cy.contains(
      'h1',
      'StreamETH International B.V. Terms and Conditions'
    ).should('exist');

    cy.get('img[alt="StreamETH logo"]').should('be.visible');
  });
});
