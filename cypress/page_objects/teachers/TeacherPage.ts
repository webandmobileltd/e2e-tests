import { By } from '../../support/By';
import VideoCollection from '../domain/VideoCollection';
import { MenuPage, TeachersVideoDetailsPage } from './index';

export class TeacherPage {
  public log(message: string) {
    cy.log(message);
    return this;
  }

  public itShowsNotification(text: string) {
    cy.get('body').should('contain', text);
    return this;
  }

  public menu() {
    return new MenuPage();
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

  public goToFirstVideo() {
    cy.get(By.dataQa('video-card'))
      .first()
      .click();
    expect(cy.get(By.dataQa('video-title')));

    return cy
      .location()
      .then(location => {
        const pathname = location.pathname;
        const parts = pathname.split('/');
        const id = parts[parts.length - 1];
        return id;
      })
      .then(id => {
        return new TeachersVideoDetailsPage(id);
      });
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
