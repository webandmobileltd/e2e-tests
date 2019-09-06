import { By } from '../../support/By';

export class BackofficePage {
  private readonly url: string;

  constructor() {
    this.url = Cypress.env('BACKOFFICE_BASE_URL');
  }

  public visit() {
    cy.visit(this.url);
    return this;
  }

  public logIn() {
    cy.get('#username').type(Cypress.env('BACKOFFICE_USERNAME'));
    cy.get('#password').type(Cypress.env('BACKOFFICE_PASSWORD'));
    cy.get('#kc-form-login').submit();
    return this;
  }

  public goToContentPartnerPage() {
    cy.get(By.dataQa('content-management'))
      .trigger('mouseover')
      .get(By.dataQa('content-partners-menu'))
      .click();

    return this;
  }

  public contentPartnerTableHasData() {
    cy.get(By.dataQa('content-partner'))
      .its('length')
      .should('be.gte', 1);

    return this;
  }
}
