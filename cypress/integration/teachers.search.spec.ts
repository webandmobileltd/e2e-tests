import { v4 as uuid } from 'uuid';
import { CollectionPage } from '../page_objects/teachers/CollectionPage';
import { CollectionsPage } from '../page_objects/teachers/CollectionsPage';
import { TeachersHomepage } from '../page_objects/teachers/TeachersHomepage';
import { TeachersVideoDetailsPage } from '../page_objects/teachers/TeachersVideoDetailsPage';
import ViewPort from '../page_objects/types/ViewPort';
import { sizes } from './viewports';

context('B2T Search', () => {
  const username = `${uuid()}@boclips.com`;
  const password = uuid();

  before(() => {
    new TeachersHomepage()
      .log('creating an account')
      .visit()
      .goToRegistrationPage()
      .createAccount(username, password)
      .accountCreated();
  });

  specify('search journey', () => {
    const email = 'test@test.com';
    const homepage = new TeachersHomepage();
    const invalidSearchQuery = 'asdfghjklkjhgf';

    homepage
      .log('searching videos')
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
      // Since we're unable to add the subject to the video, we cannot assert the search count
      // .applySubjectFilter('Biology')
      // .inspectResults(videos => {
      //   expect(videos.length).to.be.eq(3, `There are three videos showing`);
      // })
      .applyDurationFilter(60, 120)
      .inspectResults(videos => {
        expect(videos.length).to.be.eq(3, `There are three videos showing`);
      })
      .applyAgeRangeFilter(4, 10)
      .inspectResults(videos => {
        expect(videos.length).to.be.eq(2, `There are two videos showing`);
      })
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

    const collectionTitle = 'Minute Physics';
    new TeachersHomepage()
      .log('searching collections')
      .visit()
      .searchWithAutocomplete('Min', 'Minute Physics')
      .createCollectionFromVideo(0, collectionTitle)
      .goToCollections();

    new CollectionsPage().goToCollectionDetails(collectionTitle);

    new CollectionPage().setVisibility(true).goToCollections();

    new TeachersHomepage()
      .visit()
      .search(collectionTitle)
      .inspectCollections(collections => {
        expect(collections.length).to.be.greaterThan(
          0,
          `There are no collections showing`,
        );
        expect(collections[0].title).to.equal(collectionTitle);
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
