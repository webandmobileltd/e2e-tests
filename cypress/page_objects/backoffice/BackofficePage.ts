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

  public goToIngestsPage() {
    cy.get(By.dataQa('ingest-sub-menu'))
      .trigger('mouseover')
      .get(By.dataQa('video-ingests-menu'))
      .click();

    return this;
  }

  public jobsTableHasData() {
    cy.wait(2000)
      .reload()
      .get(By.dataQa('job'))
      .its('length')
      .should('be.gte', 1);

    return this;
  }

  public goToFirstJobDetails() {
    cy.get(By.dataQa('job'))
      .first()
      .click();
    return this;
  }

  public videosTableHasVideo() {
    cy.get(By.dataQa('video-id'))
      .its('text')
      .should('be', 'CCAI_01_CLEAN_What-Is-AI');
    return this;
  }

  public importOrderCSV() {
    findOneValidVideoId().then(videoId => {
      cy.get(By.dataQa('upload-dropzone')).then(dropzone => {
        const content = `Order No,Order Through Platform,Month Date ,Order request Date,Order Fulfillment Date,Quarter,Member (request),Member (authorise) ID,Clip ID,Title,Source,Source Code,License Duration,Territory,Type,Price,Publisher,ISBN / PRODUCT DESCRIP,Language,Captioning,Trim,Notes,Remittance Notes,
129,yes,Nov-15,05/11/15,,2015 Q4,Susan Andrews,871,${videoId},Learning from proximity to power,XKA Digital,123,5,Europe,Instructional Clips,£200 ,ICS,,,,,Complete,`;
        this.uploadCSV(content, dropzone);
      });
    });

    return this;
  }

  public importJobCSV() {
    findOneValidVideoId().then(() => {
      cy.get(By.dataQa('upload-dropzone')).then(dropzone => {
        const content = `Provider,Unique ID,Title,Description,Creation Date,Keywords,Subject,Type ID,Legal Restrictions,URL
Crash Course Artificial Intelligence,CCAI_01_CLEAN_What-Is-AI,What Is Artificial Intelligence? #1,"Artificial intelligence is everywhere",09/08/2019,"Crash course|Artificial intelligence",Computer Science,3,,https://kmvideowatchfolder.s3-eu-west-1.amazonaws.com/Crash_Course/CCAI_01_CLEAN_What-Is-AI.mp4`;
        this.uploadCSV(content, dropzone);
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

    /*
     * Electron doesn't play nicely with downloaded files in ci. It prompts the user with a selector that needs native events to interact with
     * https://github.com/cypress-io/cypress/issues/433
     */
    // cy.get(By.dataQa('submit-fx-rates')).click();

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

  public updateOrderItemDuration(duration: string, index: number = 0) {
    this.startOrderRowEdit(index);

    cy.get(By.dataQa('duration-edit'))
      .find('input')
      .clear()
      .type(duration);

    this.saveOrderRowEdit();

    cy.get(By.dataQa('license-duration')).contains(duration);

    return this;
  }

  public updateOrderItemTerritory(territory: string, index: number = 0) {
    this.startOrderRowEdit(index);

    cy.get(By.dataQa('territory-edit'))
      .find('input')
      .clear()
      .type(territory);

    this.saveOrderRowEdit();

    cy.get(By.dataQa('license-territory')).contains(territory);

    return this;
  }

  public loadOrderById(orderId: string) {
    cy.get(By.dataState(orderId)).click();

    return this;
  }

  private uploadCSV(content: string, dropzone: JQuery<HTMLElement>) {
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
  }

  private startOrderRowEdit(index: number = 0) {
    cy.get(By.dataQa('edit-row-button'))
      .eq(index)
      .click({ force: true });
  }

  private saveOrderRowEdit() {
    cy.get(By.dataQa('inline-save'))
      .first()
      .click({ force: true });
  }
}
