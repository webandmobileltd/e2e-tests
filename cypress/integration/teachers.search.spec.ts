import { v4 as uuid } from 'uuid';
import { TeachersHomepage } from '../page_objects/teachers';

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
    const nonEducationalSearchQuery = 'Celebrities on the red carpet';
    const collectionTitle = 'Minute Physics';
    const queryWithNewsAndNonNews = 'richard';

    homepage
      .log('logging in')
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

      .log('searching non educational videos')
      .menu()
      .search(nonEducationalSearchQuery)
      .noVideosShown()

      .log('searching news and non news')
      .menu()
      .search(queryWithNewsAndNonNews)
      .inspectResults(videos => {
        expect(videos.length).to.be.greaterThan(
          0,
          `There are no videos showing`,
        );
      })
      .goToNewsPage(false)
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
      .goBackToMainSearchPage(false)

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

      .log('testing paging')
      .isOnPage(1)
      .goToNextPage()
      .isOnPage(2)
      .goToPreviousPage()
      .isOnPage(1)

      .log('testing subject filter')
      .applySubjectFilter('Biology')
      .inspectResults(videos => {
        expect(videos.length).to.be.eq(3, `There are two videos showing`);
      })
      .removeFilterTag('Biology')

      .log('testing duration filter')
      .applyDurationFilter(0, 240)
      .inspectResults(videos => {
        expect(videos.length).to.be.eq(9, `There is one video showing`);
      })

      .log('testing age range filter')
      .applyAgeRangeFilter(3, 11)
      .inspectResults(videos => {
        expect(videos.length).to.be.eq(1, `There are two videos showing`);
      })

      .log('testing video rating')
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
});
