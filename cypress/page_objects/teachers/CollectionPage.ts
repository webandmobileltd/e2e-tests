import { By } from '../../support/By';
import Video from '../domain/Video';
import { TeachersPage } from './TeachersPage';

export class CollectionPage extends TeachersPage {
  public reload() {
    cy.reload();
    return this;
  }

  public setName(name: string): CollectionPage {
    cy.get(By.dataQa('collection-edit-button')).click();
    cy.get(By.dataQa('title-edit'))
      .clear()
      .type(name);
    cy.contains('Save').click();
    return this;
  }

  public setVisibility(isPublic: boolean): CollectionPage {
    cy.get(By.dataQa('collection-edit-button')).click();
    const visiblityCheckBox = cy.get(By.dataQa('visibility-edit'));

    if (isPublic) {
      visiblityCheckBox.check();
    } else {
      visiblityCheckBox.uncheck();
    }

    cy.contains('Save').click();

    return this;
  }

  public itHasCorrectVisiblity(isPublic: boolean): CollectionPage {
    cy.get(By.dataQa('collection-visibility'))
      .get(By.dataState(isPublic + ''))
      .should('exist');
    return this;
  }

  public itHasName(name: string): CollectionPage {
    cy.get(By.dataQa('collection-name')).should('contain', name);
    return this;
  }

  public checkA11yOnCollectionPage(threshold: number) {
    cy.get(By.dataQa('collection-name'));
    cy.checkA11y(threshold);
    return this;
  }

  private itemsHtmlElements() {
    return cy.get(By.dataQa('video-card'));
  }

  private extractVideosFromHtmlElements(
    videoCards: JQuery<HTMLElement>,
  ): Video[] {
    const videos: Video[] = [];
    videoCards.each((idx, el: HTMLElement) => {
      videos.push({
        title: el.querySelector(By.dataQa('video-title'))!.textContent!,
        description: el.querySelector(By.dataQa('video-description'))!
          .textContent!,
      });
    });
    return videos;
  }

  public isEmpty() {
    cy.get(By.dataQa('collection-empty-title'));
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
      cy.get('[data-qa="remove-from-collection"]:visible').click(),
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
