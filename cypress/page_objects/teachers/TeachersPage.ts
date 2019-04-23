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

  protected getCollectionCardsFromHtmlElements() {
    return cy.get(By.dataQa('collection-card'));
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
