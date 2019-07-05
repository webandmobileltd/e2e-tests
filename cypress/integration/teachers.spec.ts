import { v4 as uuid } from 'uuid';
import { TeachersHomepage } from '../page_objects/teachers';

context('Teachers', () => {
  const username = `${uuid()}@boclips.com`;
  const password = uuid();

  before(() => {
    new TeachersHomepage()
      .log('creating an account')
      .visit()
      .goToRegistrationPage()
      .createAccount(username, password)
      .accountCreated()

      .log('logging in')
      .visit()
      .logIn(username, password);
  });

  context('B2T Search', () => {
    it('search & rate journey', () => {
      const email = 'test@test.com';
      const homepage = new TeachersHomepage();
      const invalidSearchQuery = 'asdfghjklkjhgf';
      const nonEducationalSearchQuery = 'Celebrities on the red carpet';
      const MINUTE_PHYSICS = 'Minute Physics';
      const queryWithNewsAndNonNews = 'richard';

      homepage
        .log('creating searchable collection')
        .visit()
        .searchWithAutocomplete('Min', MINUTE_PHYSICS)
        .createCollectionFromVideo(0, MINUTE_PHYSICS)
        .menu()
        .goToCollections()
        .goToCollectionDetails(MINUTE_PHYSICS)
        .setVisibility(true)
        .menu()
        .goToHomepage()

        .log('searching collections')
        .menu()
        .search(MINUTE_PHYSICS)
        .inspectCollections(collections => {
          expect(collections.length).to.be.greaterThan(
            0,
            `There are no collections showing`,
          );
          expect(collections[0].title).to.equal(MINUTE_PHYSICS);
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

        .log('testing paging')
        .menu()
        .search(MINUTE_PHYSICS)
        .isOnPage(1)
        .goToNextPage()
        .isOnPage(2)
        .goToPreviousPage()
        .isOnPage(1)

        .log('testing subject filter')
        .applySubjectFilter('Biology')
        .inspectResults(videos => {
          expect(videos.length).to.be.eq(3, `There are three videos showing`);
        })
        .removeFilterTag('Biology')

        .log('testing duration filter')
        .applyDurationFilter(0, 240)
        .inspectResults(videos => {
          expect(videos.length).to.be.eq(9, `There are nine videos showing`);
        })

        .log('testing age range filter')
        .applyAgeRangeFilter(3, 11)
        .inspectResults(videos => {
          expect(videos.length).to.be.eq(1, `There is one video showing`);
        })

        .removeFilterTag('3-11')
        .removeFilterTag('0m-2m')

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

  context('Collections', () => {
    const expectedCompletion = 'Minute Physics';

    specify('collection journey', () => {
      const collectionTitle = uuid();
      const newCollectionTitle = uuid();

      new TeachersHomepage()
        .log('creating a collection')
        .menu()
        .search(expectedCompletion)
        .createCollectionFromVideo(0, collectionTitle)

        .log('managing collection videos')
        .addVideoToCollection(1, collectionTitle)
        .isVideoInCollection(1, collectionTitle)
        .reload()
        .removeVideoFromCollection(1, collectionTitle)

        .log('editing a collection')
        .menu()
        .goToCollections()
        .inspectCollections(collections =>
          expect(collections).to.have.length(1),
        )
        .goToCollectionDetails(collectionTitle)
        .setVisibility(true)
        .setSubject('Biology')
        .setName(newCollectionTitle)
        .itHasCorrectVisiblity(true)
        .itHasName(newCollectionTitle)

        .log('verifying and managing videos')
        .inspectItems(videos => expect(videos).to.have.length(1))
        .reload()
        .itHasName(newCollectionTitle)
        .inspectItems(videos => expect(videos).to.have.length(1))
        .removeVideo(0)
        .isEmpty()
        .reload()
        .isEmpty()

        .log('verifying collection in discipline subject page')
        .menu()
        .goToHomepage()
        .goToDiscoverBySubject('Biology')
        .hasCollectionTitle(newCollectionTitle)

        .log('deleting a collection')
        .menu()
        .goToCollections()
        .deleteCollection(newCollectionTitle);
    });
  });
});
