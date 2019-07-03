import { By } from '../../support/By';
import { acceptDialog } from './AntUtils';
import { CollectionsPage, TeachersHomepage } from './index';

export class MenuPage {
  public search(searchQuery: string) {
    cy.get(By.dataQa('search-input'))
      .clear()
      .type(searchQuery)
      .type('{enter}');
    return new TeachersHomepage();
  }

  public goToHomepage() {
    cy.get(By.dataQa('boclips-logo')).click();
    return new TeachersHomepage();
  }

  public goToCollections() {
    this.openAccountMenu();

    cy.get("[data-qa='video-collection']:visible")
      .should('be.visible')
      .click();

    return new CollectionsPage();
  }

  public goToBookmarkedCollections() {
    this.openAccountMenu();

    cy.get("[data-qa='bookmarked-collections']:visible").click();

    return this;
  }

  private openAccountMenu() {
    cy.get(By.dataQa('account-menu-open') + `:visible`)
      .should('be.visible')
      .click();

    return this;
  }

  public logOut() {
    this.openAccountMenu();
    cy.get(By.dataQa('logout-button')).click();
    acceptDialog();
  }
}
