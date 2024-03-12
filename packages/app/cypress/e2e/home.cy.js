describe('Tests for homepage', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Displays a list of organizations, which should have text', () => {
    cy.get(':nth-child(3) > .my-2 > a > .font-semibold').should(
      'not.be.empty'
    )
    cy.get(':nth-child(4) > .my-2 > a > .font-semibold').should(
      'not.be.empty'
    )
    cy.get(':nth-child(0) > .my-2 > a > .font-semibold').should(
      'not.be.empty'
    )
  })

  it('Give page a search parameter and press Enter', () => {
    cy.get('.flex-grow > .flex-col > .flex').type('jonas')
    cy.get('.flex-grow > .flex-col > .flex').type('{enter}')
  })

  it('can click image', () => {
    cy.get(
      ':nth-child(2) > .overflow-y-auto > .max-w-screen > .lg\\:grid > :nth-child(1) > .min-h-full'
    ).click()
  })

  it('can click description', () => {
    cy.get(
      ':nth-child(2) > .min-h-full > .flex-col > [href="/archive?event=ethporto_2023"] > .flex > .text-xs'
    ).click()
  })

  it('can click organization name', () => {
    cy.get(':nth-child(1) > .my-2 > a > .font-semibold').click()
  })

  it('Video is playing on the homepage', () => {
    cy.get('div > video')
      .should('exist')
      .then(($video) => {
        const videoElement = $video.get(0)

        expect(videoElement.paused).to.be.false
      })
  })
})
