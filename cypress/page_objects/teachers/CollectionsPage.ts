import { By } from '../../support/By';
import Video from '../domain/Video';
import VideoCollection from '../domain/VideoCollection';
import { TeachersPage } from './TeachersPage';

export class CollectionsPage extends TeachersPage {
  public reload() {
    cy.reload();
    return this;
  }

  public isEmpty() {
    cy.get(By.dataQa('collections-view-empty'));
    return this;
  }

  public goToCollectionDetails(collectionTitle: string) {
    cy.get(
      `[data-state='${collectionTitle}'][data-qa='collection-card']:visible`,
    ).click();
    return this;
  }

  public deleteCollection(collectionTitle: string) {
    cy.get(`[data-state='${collectionTitle}'][data-qa='collection-card']`)
      .get(By.dataQa('delete-collection'))
      .click();
    this.acceptDialog();
    return this;
  }

  public inspectCollections(
    callback: (collections: VideoCollection[]) => void,
  ) {
    this.getCollectionCardsFromHtmlElements()
      .then(this.extractCollectionsFromHtmlElements)
      .then(callback);
    return this;
  }
}
