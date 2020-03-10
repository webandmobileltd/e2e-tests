import {By} from '../../support/By';
import Video from '../domain/Video';
import {TeacherPage} from './index';

export class TeachersHomepage extends TeacherPage {
  private readonly url: string;

  constructor() {
    super();
    this.url = Cypress.env('TEACHERS_BASE_URL');
  }

  public configureHubspotCookie() {
    cy.setCookie('__hs_opt_out', 'yes');
    return this;
  }

  public visit() {
    cy.visit(this.url);
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
    cy.server({enable: false});
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

  public applyAgeRangeFilter(filterName: string) {
    cy.get('label')
      .contains(filterName)
      .click()
      .get('input[type=checkbox]')
      .should('be.checked')
      .log(`Checked checkbox ${filterName}`)
      .get('body')
      .get(By.dataQa(`age-range-filter-tag`))
      .contains(filterName)
      .get(By.dataQa('close-tag'))
      .should('be.visible')
      .log(`Filter tag ${filterName} was visible`);

    return this;
  }

  public applySubjectFilter(filterName: string) {
    cy.get('label')
      .contains(filterName)
      .click()
      .get('input[type=checkbox]')
      .should('be.checked')
      .log(`Checked checkbox ${filterName}`)
      .get('body')
      .get(By.dataQa(`subject-filter-tag`))
      .contains(filterName)
      .get(By.dataQa('close-tag'))
      .should('be.visible')
      .log(`Filter tag ${filterName} was visible`);

    return this;
  }

  public applyDurationFilter(filterName: string) {
    cy.get('label')
      .contains(filterName)
      .click()
      .get('input[type=checkbox]')
      .should('be.checked')
      .log(`Checked checkbox ${filterName}`)
      .get('body')
      .get(By.dataQa(`duration-filter-tag`))
      .contains(filterName)
      .get(By.dataQa('close-tag'))
      .should('be.visible')
      .log(`Filter tag ${filterName} was visible`);

    return this;
  }

  public removeFilterTag(filterName: string) {
    cy.get(By.dataQa(`filter-tag`))
      .contains(filterName)
      .get(By.dataQa('close-tag'))
      .click()
      .log(`Removed filter tag ${filterName}`)
      .should('not.be.visible');

    return this;
  }

  public inspectResults(callback: (videos: Video[]) => void) {
    this.searchResultsHtmlElements()
      .then(this.extractVideosFromHtmlElements)
      .then(callback);
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
}
