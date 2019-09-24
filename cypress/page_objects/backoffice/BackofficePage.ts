import { findOneVideoId } from '../../../setup/api/videoApi';
import { getParametrisedVideoFixtures } from '../../../setup/fixture/videos';
import { generateToken } from '../../../setup/generateToken';
import { By } from '../../support/By';
import { findOneValidVideoId } from '../../support/cypressBoclipsApiWrappers/findOneValidVideoId';

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

  public goToOrdersPage() {
    cy.get(By.dataQa('orders-menu')).click();

    return this;
  }

  public importOrderCSV() {
    cy.get(By.dataQa('import-order-button')).click();
    findOneValidVideoId().then(id => {
      console.log(id);
      cy.get(By.dataQa('upload-dropzone')).then(dropzone => {
        const content = `Order No,Month Date ,Order request Date,Order Fulfillment Date,Quarter,Member (request),Member (authorise) ID,Clip ID,Title,Source,Source Code,License Duration,Territory,Type,Price,Publisher,ISBN / PRODUCT DESCRIP,Language,Captioning,Trim,Notes,Remittance Notes
129,Nov-15,05/11/15,,2015 Q4,Susan Andrews,871,${id},Learning from proximity to power,XKA Digital,,5,Europe,Instructional Clips,£200 ,ICS,,,,,Complete,`;
        const blob = new Blob([content]);
        const orderFile = new File([blob], 'orders.csv', {
          type: 'text/csv',
        });

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(orderFile);

        cy.wrap(dropzone, { log: false }).trigger('drop', {
          force: true,
          dataTransfer,
        });
      });
    });

    return this;
  }

  public nthOrderHasID(orderId: string) {
    cy.get(By.dataQa('order'))
      .get(By.dataQa('order-id'))
      .contains(orderId);

    return this;
  }
}
