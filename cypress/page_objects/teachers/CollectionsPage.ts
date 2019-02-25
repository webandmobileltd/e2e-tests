import { By } from '../../support/By';
import Video from '../domain/Video';
import VideoCollection from "../domain/VideoCollection";

export class CollectionsPage {

  public reload() {
    cy.reload();
    return this;
  }

  private itemsHtmlElements() {
    return cy.get(By.dataQa("collection-card"));
  }

  private extractCollectionsFromHtmlElements(videoCards: JQuery<HTMLElement>): VideoCollection[] {
    const collections: VideoCollection[] = [];
    videoCards.each((idx, el: HTMLElement) => {
      collections.push({
        title: el.querySelector(By.dataQa("collection-title"))!.textContent!,
        numberOfVideos: Number(el.querySelector(By.dataQa("collection-number-of-videos"))!
          .textContent!)
      });
    });
    return collections;
  }

  public isEmpty() {
    cy.get(By.dataQa("collections-view-empty"));
    return this;
  }

  public goToCollectionDetails(collectionTitle: string) {
    cy.get(`[data-state='${collectionTitle}'][data-qa='view-collection']:visible`).click();
  }

  public inspectCollections(callback: (collections: VideoCollection[]) => void) {
    this.itemsHtmlElements()
      .then(this.extractCollectionsFromHtmlElements)
      .then(callback);
    return this;
  }

  private interactWithCollections(index: number, callback: () => void) {
    this.itemsHtmlElements()
      .eq(index)
      .scrollIntoView()
      .within(callback);
    return this;
  }
}
