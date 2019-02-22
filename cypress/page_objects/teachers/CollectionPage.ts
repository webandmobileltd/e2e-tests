import { By } from "../../support/By";
import Video from "../domain/Video";

export class CollectionPage {
  public reload() {
    cy.reload();
    return this;
  }

  public setName(name: string): CollectionPage {
    cy.get(By.dataQa("collection-name-edit")).click();
    cy.get(By.dataQa("collection-name-edit-input"))
      .clear()
      .type(name);
    cy.get(By.dataQa("collection-name-edit-submit")).click();
    return this;
  }

  public itHasName(name: string): CollectionPage {
    cy.get(By.dataQa("collection-name")).should("contain", name);
    return this;
  }

  private itemsHtmlElements() {
    return cy.get(By.dataQa("video-card"));
  }

  private extractVideosFromHtmlElements(
    videoCards: JQuery<HTMLElement>
  ): Video[] {
    const videos: Video[] = [];
    videoCards.each((idx, el: HTMLElement) => {
      videos.push({
        title: el.querySelector(By.dataQa("video-title"))!.textContent!,
        description: el.querySelector(By.dataQa("video-description"))!
          .textContent!
      });
    });
    return videos;
  }

  public isEmpty() {
    cy.get(By.dataQa("collection-empty-title"));
    return this;
  }

  public inspectItems(callback: (videos: Video[]) => void) {
    this.itemsHtmlElements()
      .then(this.extractVideosFromHtmlElements)
      .then(callback);
    return this;
  }

  public removeVideo(index: number) {
    return this.interactWithItem(index, () =>
      cy.get(By.dataQa("remove-from-collection")).click()
    );
  }

  private interactWithItem(index: number, callback: () => void) {
    this.itemsHtmlElements()
      .eq(index)
      .scrollIntoView()
      .within(callback);
    return this;
  }
}
