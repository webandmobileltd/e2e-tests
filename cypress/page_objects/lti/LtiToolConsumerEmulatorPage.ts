export class LtiToolConsumerEmulatorPage {
  private readonly url: string;

  constructor() {
    this.url = Cypress.env('LTI_TOOL_CONSUMER_EMULATOR_URL');
  }

  public visit() {
    cy.visit(this.url);
    return this;
  }

  public provideLaunchRequestData(videoId: string) {
    cy.get('[name="endpoint"]')
      .clear()
      .type(Cypress.env('LTI_LAUNCH_URL'));
    cy.get('[name="key"]')
      .clear()
      .type(Cypress.env('LTI_CONSUMER_KEY'));
    cy.get('[name="secret"]')
      .clear()
      .type(Cypress.env('LTI_CONSUMER_SECRET'));
    cy.get('.required')
      .find('[name="resource_link_id"]')
      .clear()
      .type(videoId);

    return this;
  }

  public saveData() {
    cy.get('[id="save_top"]').click();

    return this;
  }

  public launchToolProvider() {
    cy.get('[id=launch_top]').click();

    return this;
  }

  public hasLoadedBoclipsPlayer() {
    cy.get('iframe')
      .then(iframe => {
        return new Promise(resolve => {
          const intervalHandle = setInterval(() => {
            const isPlayerRendered =
              iframe.contents().find('[data-boclips-player-initialised=true]')
                .length > 0;
            if (isPlayerRendered) {
              clearInterval(intervalHandle);
              resolve(iframe.contents().find('body')[0]);
            }
          }, 100);
        });
      })
      .then(loadedIframeBody => {
        cy.wrap(loadedIframeBody)
          .find('[data-boclips-player-initialised=true]')
          .should('be.visible');
      });

    return this;
  }
}
