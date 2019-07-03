import { v4 as uuid } from 'uuid';
import { TeachersHomepage } from '../page_objects/teachers';
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

  it('search & rate journey', () => {
    const email = 'test@test.com';
    const homepage = new TeachersHomepage();
    const invalidSearchQuery = 'asdfghjklkjhgf';
    const collectionTitle = 'Minute Physics';

    homepage
      .log('log in')
      .visit()
      .logIn(username, password)

      .log('creating searchable collection')
      .visit()
      .searchWithAutocomplete('Min', 'Minute Physics')
      .createCollectionFromVideo(0, collectionTitle)
      .menu()
      .goToCollections()
      .goToCollectionDetails(collectionTitle)
      .setVisibility(true)
      .menu()
      .goToHomepage()

      .log('searching collections')
      .menu()
      .search(collectionTitle)
      .inspectCollections(collections => {
        expect(collections.length).to.be.greaterThan(
          0,
          `There are no collections showing`,
        );
        expect(collections[0].title).to.equal(collectionTitle);
      })

      .log('searching videos')
      .menu()
      .search(invalidSearchQuery)
      .enterEmail(email)
      .searchWithAutocomplete('Min', 'Minute Physics')
      .inspectResults(videos => {
        expect(videos.length).to.be.greaterThan(
          0,
          `There are no videos showing`,
        );
      })

      .log('Testing paging')
      .isOnPage(1)
      .goToNextPage()
      .isOnPage(2)
      .goToPreviousPage()
      .isOnPage(1)

      .log('Testing subject filter')
      .applySubjectFilter('Biology')
      .inspectResults(videos => {
        expect(videos.length).to.be.eq(3, `There are two videos showing`);
      })
      .removeFilterTag('Biology')

      .log('Testing duration filter')
      .applyDurationFilter(0, 240)
      .inspectResults(videos => {
        expect(videos.length).to.be.eq(9, `There is one video showing`);
      })

      .log('Testing age range filter')
      .applyAgeRangeFilter(3, 11)
      .inspectResults(videos => {
        expect(videos.length).to.be.eq(1, `There are two videos showing`);
      })

      .log('Testing video rating')
      .rateFirstVideo(2)
      .assertRatingOnFirstVideo(2)
      .goToFirstVideo()
      .then(videoDetailsPage => {
        videoDetailsPage
          .visit()
          .hasTitle()
          .hasContentPartnerName()
          .assertRating(2);
      });
  });

  it('shows only educational videos', () => {
    const nonEducationalSearchQuery = 'Celebrities on the red carpet';
    const homepage = new TeachersHomepage();
    homepage
      .visit()
      .logIn(username, password)
      .menu()
      .search(nonEducationalSearchQuery)
      .noVideosShown();
  });

  sizes.forEach((size: ViewPort) => {
    it(`viewing news results on: ${
      size.isMobile ? 'mobile' : 'desktop'
    } view`, () => {
      const homepage = new TeachersHomepage();

      const queryWithNewsAndNonNews = 'richard';

      cy.viewport(size.width, size.height);

      homepage
        .visit()
        .logIn(username, password)
        .menu()
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
    });
  });
});
