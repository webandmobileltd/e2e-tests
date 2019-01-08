import { By } from '../../support/By';
import Video from '../domain/Video';

export class TeachersHomepage {
  private readonly url: string;

  constructor() {
    this.url = Cypress.env('TEACHERS_BASE_URL');
  }

  public visit() {
    cy.visit(this.url);
    return this;
  }

  public logIn() {
    cy.get('#username').type(Cypress.env('TEACHERS_USERNAME'));
    cy.get('#password').type(Cypress.env('TEACHERS_PASSWORD'));
    cy.get('#kc-form-login').submit();
    return this;
  }

  public search(searchQuery: string) {
    cy.get(By.dataQa('search-input'))
      .clear()
      .type(searchQuery)
      .type('{enter}');
    return this;
  }

  public showsVideo(callback: (videos: Video[]) => void) {
    const videos: Video[] = [];
    cy.get(By.dataQa('search-result'))
      .then(videoCards =>
        videoCards.each((idx, el: HTMLElement) => {
          videos.push({
            title: el.querySelector(By.dataQa('video-title'))!.textContent!,
            description: el.querySelector(By.dataQa('video-description'))!
              .textContent!,
          });
        }),
      )
      .then(() => callback(videos));
    return this;
  }

  enterEmail(email: string) {
    cy.get(By.dataQa('email-address'))
      .clear()
      .type(email);
    return this;
  }

  copyFirstLink() {
    cy.get(By.dataQa('copy-link'))
      .first()
      .click();
    return this;
  }

  visitCopiedLink() {
    cy.get('.ant-notification-notice-message')
      .then((message) => {
        cy.visit(message.text());
      });
    return this;
  }

  playVideo() {
    cy.get('.boclips-player')
      .click();
    return this;

  }

  isOnPage(pageNumber: number) {
    let activeElementInPagination = '[data-qa=\'pagination\'] .ant-pagination-item-active a';
    cy.get(activeElementInPagination).then(elements => {
      elements.each((idx, element: HTMLElement) => {
        let textContent = element!.textContent;
        expect(textContent).to.eq(pageNumber.toString());
      });
    });
    return this;
  }

  goToNextPage() {
    cy.get('.ant-pagination-next').click();
    return this;
  }

  goToPreviousPage() {
    cy.get('.ant-pagination-prev').click();
    return this;
  }

  goToFirstVideo() {
    cy.get(By.dataQa('link-to-details')).first().click();
    expect(cy.get(By.dataQa('video-details-title')));
    return this;
  }

  noVideosShown() {
    cy.get(By.dataQa('search-zero-results'));
    return this;
  }
}
