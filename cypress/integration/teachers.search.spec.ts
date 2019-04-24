import { v4 as uuid } from 'uuid';
import { TeachersHomepage } from '../page_objects/teachers/TeachersHomepage';
import { TeachersVideoDetailsPage } from '../page_objects/teachers/TeachersVideoDetailsPage';
import ViewPort from '../page_objects/types/ViewPort';
import { sizes } from './viewports';

context('B2T Search', () => {
  const username = `${uuid()}@boclips.com`;
  const password = uuid();

  before(() => {
    new TeachersHomepage()
      .visit()
      .goToRegistrationPage()
      .createAccount(username, password)
      .accountCreated();
  });

  afterEach(() => {
    new TeachersHomepage().visit().logOut();
  });

  specify('search journey', () => {
    const email = 'test@test.com';
    const homepage = new TeachersHomepage();
    const invalidSearchQuery = 'asdfghjklkjhgf';

    homepage
      .visit()
      .logIn(username, password)
      .search(invalidSearchQuery)
      .enterEmail(email)
      .searchWithAutocomplete('Min', 'Minute Physics')
      .inspectResults(videos => {
        expect(videos.length).to.be.greaterThan(
          0,
          `There are no videos showing`,
        );
      })
      .isOnPage(1)
      .goToNextPage()
      .isOnPage(2)
      .goToPreviousPage()
      .isOnPage(1)
      .goToFirstVideo();

    cy.location()
      .then(location => {
        const pathname = location.pathname;
        const parts = pathname.split('/');
        const id = parts[parts.length - 1];
        return id;
      })
      .then(id => {
        return new TeachersVideoDetailsPage(id);
      })
      .then(videoDetailsPage => {
        videoDetailsPage
          .visit()
          .hasTitle()
          .hasContentPartnerName();
      });
  });

  it('shows only educational videos', () => {
    const nonEducationalSearchQuery = 'Celebrities on the red carpet';
    const homepage = new TeachersHomepage();
    homepage
      .visit()
      .logIn(username, password)
      .search(nonEducationalSearchQuery)
      .noVideosShown();
  });

  sizes.forEach((size: ViewPort) => {
    specify(
      `viewing news results on: ${size.isMobile ? 'mobile' : 'desktop'} view`,
      () => {
        const homepage = new TeachersHomepage();

        const queryWithNewsAndNonNews = 'richard';

        cy.viewport(size.width, size.height);

        homepage
          .visit()
          .logIn(username, password)
          .search(queryWithNewsAndNonNews)
          .inspectResults(videos => {
            expect(videos.length).to.be.greaterThan(
              0,
              `There are no videos showing`,
            );
          })
          .goToNewsPage(size.isMobile)
          .inspectResults(videos => {
            expect(videos.length).to.be.greaterThan(
              0,
              `There are no videos showing`,
            );
            expect(videos[0].title).to.equal('Breaking news');
            expect(videos[1].title).to.equal(
              "'Richard St. John: 8 secrets of success' goes viral on boclips",
            );
          })
          .goBackToMainSearchPage(size.isMobile)
          .inspectResults(videos => {
            expect(videos.length).to.be.greaterThan(
              0,
              `There are no videos showing`,
            );
          });
      },
    );
  });
});
