import { getParametrisedVideoFixtures } from '../../../setup/fixture/videos';
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
    findOneValidVideoId().then(videoId => {
      cy.get(By.dataQa('upload-dropzone')).then(dropzone => {
        const content = `Order No,Order Through Platform,Month Date ,Order request Date,Order Fulfillment Date,Quarter,Member (request),Member (authorise) ID,Clip ID,Title,Source,Source Code,License Duration,Territory,Type,Price,Publisher,ISBN / PRODUCT DESCRIP,Language,Captioning,Trim,Notes,Remittance Notes,
129,yes,Nov-15,05/11/15,,2015 Q4,Susan Andrews,871,${videoId},Learning from proximity to power,XKA Digital,123,5,Europe,Instructional Clips,£200 ,ICS,,,,,Complete,`;
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

  public exportOrderCSV() {
    cy.get(By.dataQa('export-orders-csv')).click();
    cy.get(By.dataQa('usd-fx-rate-input')).type('1.5');
    cy.get(By.dataQa('eur-fx-rate-input')).type('2.5');
    cy.get(By.dataQa('sgd-fx-rate-input')).type('3.5');
    cy.get(By.dataQa('aud-fx-rate-input')).type('4.5');
    cy.get(By.dataQa('cad-fx-rate-input')).type('1.11');
    cy.get(By.dataQa('submit-fx-rates')).click();

    return this;
  }

  public updateOrderCurrency() {
    cy.get(By.dataQa('edit-currency')).click();
    cy.get(By.dataQa('currency-select')).click();
    cy.get(`.ant-select-dropdown-menu-item`)
      .contains('USD')
      .scrollIntoView()
      .click();
    cy.get(By.dataQa('inline-save')).click();
    return this;
  }

  public loadOrderById(orderId: string) {
    cy.get(By.dataState(orderId)).click();

    return this;
  }
}
