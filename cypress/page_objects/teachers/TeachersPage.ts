import { By } from '../../support/By';

export class TeachersPage {
  public search(searchQuery: string) {
    cy.get(By.dataQa('search-input'))
      .clear()
      .type(searchQuery)
      .type('{enter}');
    return this;
  }

  public logOut() {
    this.search('test');
    this.openAccountMenu();
    cy.get(By.dataQa('logout-button')).click();
    this.acceptDialog();
  }

  public acceptDialog() {
    cy.get('.ant-modal-confirm-btns .ant-btn-primary').click();
  }

  public openAccountMenu() {
    cy.get(By.dataQa('account-menu-open') + `:visible`).click();
  }

  public itShowsNotification(text: string) {
    cy.get('body').should('contain', text);
    return this;
  }

  public goToCollections() {
    this.openAccountMenu();

    cy.get("[data-qa='video-collection']:visible").click();
  }
}
