import * as queryString from 'query-string';
import { By } from '../../support/By';
import Video from '../domain/Video';
import VideoCollection from '../domain/VideoCollection';
import { acceptDialog } from './AntUtils';

class TeachersPage {
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

class MenuPage {
  public search(searchQuery: string) {
    cy.get(By.dataQa('search-input'))
      .clear()
      .type(searchQuery)
      .type('{enter}');
    return new TeachersHomepage();
  }

  public goToHomepage() {
    cy.get(By.dataQa('boclips-logo')).click();
    return new TeachersHomepage();
  }

  public goToCollections() {
    this.openAccountMenu();

    cy.get("[data-qa='video-collection']:visible")
      .should('be.visible')
      .click();

    return new CollectionsPage();
  }

  public goToBookmarkedCollections() {
    this.openAccountMenu();

    cy.get("[data-qa='bookmarked-collections']:visible").click();

    return this;
  }

  private openAccountMenu() {
    cy.get(By.dataQa('account-menu-open') + `:visible`)
      .should('be.visible')
      .click();

    return this;
  }

  public logOut() {
    this.openAccountMenu();
    cy.get(By.dataQa('logout-button')).click();
    acceptDialog();
  }
}

export class TeachersHomepage extends TeachersPage {
  private readonly url: string;

  constructor() {
    super();
    this.url = Cypress.env('TEACHERS_BASE_URL');
  }

  public visit() {
    cy.visit(this.url);
    cy.setCookie('__hs_opt_out', 'yes');
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

  private clickDropDownOption(dropdown: string, option: string) {
    cy.get(dropdown)
      .click()
      .should('be.visible');

    cy.contains(option)
      .scrollIntoView()
      .should('be.visible')
      .click();
  }

  public goToRegistrationPage() {
    cy.get(By.dataQa('create-account')).click();
    return this;
  }

  public createAccount(username: string, password: string) {
    cy.get(By.dataQa('first-name')).type('Firstname');
    cy.get(By.dataQa('last-name')).type('Lastname');
    this.clickDropDownOption(By.dataQa('subjects'), 'Biology');
    cy.get('footer').click();

    this.clickDropDownOption(By.dataQa('ageRange'), '3 - 5');
    cy.get('footer').click();

    cy.get(By.dataQa('email')).type(username);
    cy.get(By.dataQa('password')).type(password);
    cy.get(By.dataQa('password-confirm')).type(password);
    cy.get(By.dataQa('privacy-policy')).click();

    cy.server();
    cy.route('POST', '**/users').as('createUser');

    cy.get(By.dataQa('register-button')).click();

    cy.wait('@createUser');
    cy.server({ enable: false });
    return this;
  }

  public accountCreated() {
    cy.get(By.dataQa('create-account-page')).should('be.visible');
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

    cy.get('footer').click();

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
    cy.get(By.dataQa(`subject-filter-tag`))
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
    const activeElementInPagination =
      "[data-qa='pagination'] .ant-pagination-item-active a";
    cy.get(activeElementInPagination).then(elements => {
      elements.each((idx, element: HTMLElement) => {
        const textContent = element!.textContent;
        expect(textContent).to.eq(pageNumber.toString());
      });
    });
    return this;
  }

  public goToNextPage() {
    cy.get('.ant-pagination-next').click();
    return this;
  }

  public goToPreviousPage() {
    cy.get('.ant-pagination-prev').click();
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

  public rateFirstVideo(rating: number) {
    cy.get(By.dataQa('video-card'))
      .first()
      .find(By.dataQa('rating-video-button'))
      .click();

    cy.get(By.dataQa('rate-video'))
      .find('.ant-rate-star')
      .eq(rating - 1)
      .click();

    cy.get(By.dataQa('rate-button')).click();
    cy.get(By.dataQa('rate-video')).should('not.exist');
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
    cy.get(By.dataState(title, 'collection-card'))
      .find(By.dataQa('bookmark-collection'))
      .click();

    cy.get(By.dataState(title, 'collection-card'))
      .find(By.dataQa('unbookmark-collection'))
      .should('be.visible');

    cy.get(By.dataState(title, 'collection-card'))
      .find(By.dataQa('bookmark-collection'))
      .should('not.be.visible');

    return this;
  }

  public unbookmarkCollection(title: string) {
    cy.get(By.dataState(title, 'collection-card'))
      .find(By.dataQa('unbookmark-collection'))
      .click();

    cy.get(By.dataState(title, 'collection-card'))
      .find(By.dataQa('bookmark-collection'))
      .should('be.visible');

    cy.get(By.dataState(title, 'collection-card'))
      .find(By.dataQa('unbookmark-collection'))
      .should('not.be.visible');

    return this;
  }
}

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
    return new CollectionPage();
  }

  public deleteCollection(collectionTitle: string) {
    cy.get(`[data-state='${collectionTitle}'][data-qa='collection-card']`)
      .get(By.dataQa('delete-collection'))
      .click();
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
      cy
        .get('[data-qa="remove-from-collection"]:visible')
        .should('be.visible')
        .click(),
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

export class TeachersVideoDetailsPage extends TeachersPage {
  private readonly url: string;

  constructor(id: string) {
    super();
    this.url = Cypress.env('TEACHERS_BASE_URL') + '/videos/' + id;
  }

  public visit() {
    cy.visit(this.url);
    return this;
  }

  public hasTitle() {
    cy.get(By.dataQa('video-title')).should('not.be.empty');
    return this;
  }

  public hasContentPartnerName() {
    cy.get(By.dataQa('video-content-partner')).should('not.be.empty');
    return this;
  }

  public showsTitle(title: string) {
    cy.get(By.dataQa('video-title')).should('have.text', title);
    return this;
  }

  public showsContentPartnerName(contentPartnerName: string) {
    cy.get(By.dataQa('video-content-partner')).should(
      'have.text',
      contentPartnerName,
    );
    return this;
  }

  public showsSubject(subject: string) {
    cy.get(By.dataQa('video-subject')).should('have.text', subject);
    return this;
  }

  public checkA11yOnVideoPage(threshold: number) {
    cy.get(By.dataQa('video-details'));
    cy.checkA11y(threshold);
    return this;
  }

  public assertRating(rating: number) {
    cy.get(By.dataQa('rating-score'))
      .invoke('attr', 'data-state')
      .should('contain', rating);
  }
}