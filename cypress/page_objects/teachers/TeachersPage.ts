import { By } from '../../support/By';
import VideoCollection from '../domain/VideoCollection';

export class TeachersPage {
  public search(searchQuery: string) {
    cy.get(By.dataQa('search-input'))
      .clear()
      .type(searchQuery)
      .type('{enter}');
    return this;
  }

  public logOut() {
    this.openAccountMenu();
    cy.get(By.dataQa('logout-button')).click();
    this.acceptDialog();
  }

  public log(message: string) {
    cy.log(message);
    return this;
  }

  public acceptDialog() {
    cy.get('.ant-modal-confirm-btns .ant-btn-primary').click();
  }

  public openAccountMenu() {
    cy.get(By.dataQa('account-menu-open') + `:visible`)
      .should('be.visible')
      .click();

    return this;
  }

  public itShowsNotification(text: string) {
    cy.get('body').should('contain', text);
    return this;
  }

  public goToHomepage() {
    cy.get(By.dataQa('boclips-logo')).click();
  }

  public goToCollections() {
    this.openAccountMenu();

    cy.get("[data-qa='video-collection']:visible")
      .should('be.visible')
      .click();
  }

  public inspectCollections(
    callback: (collections: VideoCollection[]) => void,
  ) {
    this.getCollectionCardsFromHtmlElements(
      cy.get(By.dataQa('collections-side-panel')),
    )
      .then(this.extractCollectionsFromHtmlElements)
      .then(callback);
    return this;
  }

  protected getCollectionCardsFromHtmlElements(from = cy.get('body')) {
    return from.get(By.dataQa('collection-card'));
  }

  protected extractCollectionsFromHtmlElements(
    videoCards: JQuery<HTMLElement>,
  ): VideoCollection[] {
    const collections: VideoCollection[] = [];
    videoCards.each((idx, el: HTMLElement) => {
      collections.push({
        title: el.querySelector(By.dataQa('collection-title'))!.textContent!,
        numberOfVideos: Number(
          el.querySelector(By.dataQa('collection-number-of-videos'))!
            .textContent!,
        ),
        bookmarked:
          el.querySelector(By.dataQa('unbookmark-collection')) !== null,
      });
    });
    return collections;
  }
}
