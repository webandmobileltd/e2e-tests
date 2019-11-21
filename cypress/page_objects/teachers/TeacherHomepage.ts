import * as queryString from 'query-string';
import { By } from '../../support/By';
import Video from '../domain/Video';
import VideoCollection from '../domain/VideoCollection';
import { DiscoverPage, TeacherPage } from './index';

export class TeachersHomepage extends TeacherPage {
  private readonly url: string;

  constructor() {
    super();
    this.url = Cypress.env('TEACHERS_BASE_URL');
    cy.setCookie('__hs_opt_out', 'yes');
  }

  public visit() {
    cy.visit(this.url);
    return this;
  }

  public checkA11yOnLoginPage(threshold: number) {
    cy.get(By.dataQa('email'));
    cy.checkA11y(threshold);
    return this;
  }

  public checkA11yOnRegistrationPage(threshold: number) {
    cy.get(By.dataQa('first-name'));
    cy.checkA11y(threshold);
    return this;
  }

  public checkA11yOnHomePage(threshold: number) {
    cy.get('.home-page');
    cy.checkA11y(threshold);
    return this;
  }

  public checkA11yOnSearchPage(threshold: number) {
    cy.get(By.dataQa('search-page'));
    cy.checkA11y(threshold);
    return this;
  }

  public reload() {
    cy.reload();
    return this;
  }

  public visitRegistrationPage() {
    cy.visit(this.url + '/create-account');
    return this;
  }

  public createAccount(username: string, password: string) {
    cy.get(By.dataQa('email')).type(username);
    cy.get(By.dataQa('password')).type(password);

    cy.server();
    cy.route('POST', '**/users').as('createUser');

    cy.get(By.dataQa('register-button')).click();

    cy.wait('@createUser');
    cy.server({ enable: false });
    return this;
  }

  public activateAccount() {
    cy.get(By.dataQa('first-name')).type('Firstname');
    cy.get(By.dataQa('last-name')).type('Lastname');

    cy.get(By.dataQa('onboard-next-button')).click();

    this.clickDropDownOption(By.dataQa('subjects'), 'Biology');
    cy.get('footer').click();
    this.clickDropDownOption(By.dataQa('age-select'), '3-5');
    cy.get('footer').click();

    cy.get(By.dataQa('onboard-next-button')).click();

    this.clickDropDownOption(By.dataQa('countries-filter-select'), 'Albania');
    cy.get('footer').click();
    cy.get('[data-qa="school"] input').type('School');

    cy.get(By.dataQa('onboard-next-button')).click();

    cy.get(By.dataQa('privacy-policy')).click();

    cy.get(By.dataQa('onboard-submit-button')).click();
    return this;
  }

  public accountCreated() {
    cy.get(By.dataQa('create-account-page')).should('be.visible');
    return this;
  }

  public accountActivated() {
    cy.get('.home-page').should('be.visible');
    return this;
  }

  public logIn(username: string, password: string) {
    cy.get(By.dataQa('email')).type(username);
    cy.get(By.dataQa('password')).type(password);
    cy.get(By.dataQa('login-button')).click();
    return this;
  }

  public searchWithAutocomplete(searchQuery: string, completion: string) {
    cy.get(By.dataQa('search-input'))
      .last()
      .should('be.visible')
      .clear()
      .type(searchQuery);
    cy.get('.search-completions').within(() => {
      cy.contains(completion).click();
    });

    return this;
  }

  public applyAgeRangeFilter(minAge: number, maxAge: number) {
    this.changeQueryParams({
      age_range_min: '' + minAge,
      age_range_max: '' + maxAge,
    });
    return this;
  }

  public applySubjectFilter(subjectName: string) {
    cy.get(By.dataQa('open-filter-modal')).click();

    cy.get('[data-qa="subjects"]')
      .click()
      .should('be.visible');

    cy.get(`.ant-select-dropdown-menu-item`)
      .contains(subjectName)
      .scrollIntoView()
      .click();

    cy.get('.ant-modal-title').click();

    cy.contains('OK').click();
    cy.get(By.dataQa('open-filter-modal')).should('not.be.visible');
    return this;
  }

  public applyDurationFilter(minDuration: number, maxDuration: number) {
    this.changeQueryParams({
      duration_min: '' + minDuration,
      duration_max: '' + maxDuration,
    });

    return this;
  }

  public removeFilterTag(filterName: string) {
    cy.get(By.dataQa(`filter-tag`))
      .contains(filterName)
      .get(By.dataQa('close-tag'))
      .click();

    return this;
  }

  private changeQueryParams(newParameters: { [key: string]: string }) {
    cy.location().then(location => {
      const parsedUrl = queryString.parseUrl(location.href);

      const parsedParams = {
        ...parsedUrl.query,
        ...newParameters,
      };

      cy.visit(`${parsedUrl.url}?${queryString.stringify(parsedParams)}`);
    });
  }

  private searchResultsHtmlElements() {
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

  public inspectResults(callback: (videos: Video[]) => void) {
    this.searchResultsHtmlElements()
      .then(this.extractVideosFromHtmlElements)
      .then(callback);
    return this;
  }

  private interactWithResult(index: number, callback: () => void) {
    return this.searchResultsHtmlElements()
      .eq(index)
      .scrollIntoView()
      .within(callback);
  }

  public createCollectionFromVideo(index: number, collectionTitle: string) {
    this.interactWithResult(index, () => {
      cy.get("[data-qa='video-collection-menu']:visible")
        .should('be.visible')
        .click();
    })
      .get(By.dataQa('create-collection'))
      .click()
      .get(By.dataQa('new-collection-title'))
      .type(collectionTitle)
      .get(By.dataQa('create-collection-button'))
      .click()
      .wait(2000);

    return this;
  }

  public addVideoToCollection(index: number, collectionTitle: string) {
    this.interactWithResult(index, () => {
      cy.get("[data-qa='video-collection-menu']:visible")
        .should('be.visible')
        .click();
    })
      .get(`[data-state="${collectionTitle}"][data-qa="add-to-collection"]`)
      .should('be.visible')
      .click();
    return this;
  }

  public removeVideoFromCollection(index: number, collectionTitle: string) {
    this.interactWithResult(index, () => {
      cy.get("[data-qa='video-collection-menu']:visible").click();
    })
      .get(
        `[data-state="${collectionTitle}"][data-qa="remove-from-collection"]`,
      )
      .should('be.visible')
      .click();
    return this;
  }

  public isVideoInCollection(index: number, collectionTitle: string) {
    this.searchResultsHtmlElements()
      .eq(index)
      .within(() => {
        cy.get(`[data-qa='video-collection-menu']:visible`).click();
      })
      .get(
        `[data-state="${collectionTitle}"][data-qa="remove-from-collection"]`,
      )
      .should('be.visible');

    return this;
  }

  public enterEmail(email: string) {
    cy.get(By.dataQa('email-address'))
      .clear()
      .type(email);
    return this;
  }

  public copyFirstLink() {
    cy.get(By.dataQa('copy-link'))
      .first()
      .click();
    return this;
  }

  public visitCopiedLink() {
    cy.get('.ant-notification-notice-message').then(message => {
      cy.visit(message.text());
    });
    return this;
  }

  public playVideo() {
    cy.get('.boclips-player').click();
    return this;
  }

  public isOnPage(pageNumber: number) {
    cy.get("[data-qa='pagination'] .ant-pagination-item-active a").should(
      'contain',
      pageNumber,
    );
    return this;
  }

  public goToPage(pageNumber: number) {
    cy.get(
      `[data-qa='pagination'] .ant-pagination-item-${pageNumber} a`,
    ).click();
    return this;
  }

  public assertRatingOnFirstVideo(rating: number) {
    cy.get(By.dataQa('video-card'))
      .first()
      .find(By.dataQa('rating-score'))
      .invoke('attr', 'data-state')
      .should('contain', rating);
    return this;
  }

  public assertPedagogicalTagOnFirstVideo(tag: string) {
    cy.get(By.dataQa('video-card'))
      .first()
      .find(By.dataQa('best-for-tags'))
      .find(By.dataQa('filter-tag'))
      .should('have.contain.text', tag);
    return this;
  }

  public rateAndTagVideo(rating: number, tag?: string) {
    cy.get(By.dataQa('rating-video-button'))
      .first()
      .click();

    cy.get(By.dataQa('rate-video'))
      .find('.ant-rate-star')
      .eq(rating - 1)
      .click();

    if (tag) {
      cy.get(By.dataState('Hook', 'tag-radio')).click();
    }

    cy.get(By.dataQa('rate-button')).click();
    return this;
  }

  public noVideosShown() {
    cy.get(By.dataQa('search-zero-results'));
    return this;
  }

  public goToNewsPage(isMobile: boolean) {
    if (isMobile) {
      return this.goToNewsPageMobile();
    }

    cy.get(By.dataQa('news-side-panel'))
      .find('button')
      .click();

    return this;
  }

  public goToNewsPageMobile() {
    cy.get(By.dataQa('tab'))
      .contains('News')
      .click();

    return this;
  }

  public goBackToMainSearchPage(isMobile: boolean) {
    if (isMobile) {
      return this.goBackToMainSearchPageMobile();
    }

    cy.get(By.dataQa('news-header'))
      .find('button')
      .click();

    return this;
  }

  public goBackToMainSearchPageMobile() {
    cy.get(By.dataQa('tab'))
      .contains('Main')
      .click();

    return this;
  }

  public inspectPublicCollections(
    callback: (collections: VideoCollection[]) => void,
  ) {
    this.getCollectionCardsFromHtmlElements()
      .then(this.extractCollectionsFromHtmlElements)
      .then(callback);
    return this;
  }

  public checkCollectionBookmarkStatus(
    collectionName: string,
    expectedState: boolean,
  ) {
    cy.get(By.dataState(collectionName, 'collection-card'))
      .find(
        By.dataQa(
          `${expectedState ? 'unbookmark-collection' : 'bookmark-collection'}`,
        ),
      )
      .should('be.visible');

    return this;
  }

  public bookmarkCollection(title: string) {
    this.getFirstCollectionCardBy(title)
      .find(By.dataQa('bookmark-collection'))
      .click();

    this.getFirstCollectionCardBy(title)
      .find(By.dataQa('unbookmark-collection'))
      .should('be.visible');

    this.getFirstCollectionCardBy(title)
      .find(By.dataQa('bookmark-collection'))
      .should('not.be.visible');

    return this;
  }

  public unbookmarkCollection(title: string) {
    this.getFirstCollectionCardBy(title)
      .find(By.dataQa('unbookmark-collection'))
      .click();

    this.getFirstCollectionCardBy(title)
      .find(By.dataQa('bookmark-collection'))
      .should('be.visible');

    this.getFirstCollectionCardBy(title)
      .find(By.dataQa('unbookmark-collection'))
      .should('not.be.visible');

    return this;
  }

  public goToDiscoverBySubject(subject: string) {
    cy.get(By.dataQa('discipline-subject'))
      .contains(subject)
      .click();
    return new DiscoverPage();
  }

  private getFirstCollectionCardBy(title: string): Cypress.Chainable {
    return cy.get(By.dataState(title, 'collection-card')).first();
  }
}
