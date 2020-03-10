import { By } from '../../support/By';
import VideoCollection from '../domain/VideoCollection';
import { acceptDialog } from './AntUtils';
import { CollectionPage, TeacherPage } from './index';

export class CollectionsPage extends TeacherPage {
  public reload() {
    cy.reload();
    return this;
  }

  public isEmpty() {
    cy.get(By.dataQa('collections-view-empty'));
    return this;
  }

  public goToCollectionDetails(collectionTitle: string) {
    return cy
      .get(
        `[data-state='${collectionTitle}'][data-qa='collection-card']:visible`,
      )
      .click()
      .then(() => {
        return new CollectionPage();
      });
  }

  public deleteCollection(collectionTitle: string) {
    cy.get(`[data-state='${collectionTitle}'][data-qa='collection-card']`)
      .find(By.dataQa('collection-edit-button'))
      .click();
    cy.get('[data-qa="delete-collection"]').click();
    acceptDialog();
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
